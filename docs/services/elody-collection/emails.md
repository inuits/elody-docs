# Emails

The collection API ships a small email service that sends HTML emails over
SMTP. It is split in two layers. The base layer, `BaseEmailService` in
`collection-api/api/services/emails`, handles everything that is the same for
every client: SMTP configuration, connection security, authentication, Jinja
template rendering, and building a multipart message with a plain-text
alternative. The client layer is a subclass in the client's collection module
that owns everything client-specific: templates, subjects, copy, and one method
per kind of email the client sends.

This document covers configuration, the base API, how to write a client
service, local development with Mailpit, and testing.

## Configuration

Every constructor argument of `BaseEmailService` is optional. When an argument
is omitted, the service falls back to an environment variable, and then to a
default. In most cases you instantiate the service without arguments and
configure it through the environment.

| Argument        | Environment variable | Default                                  |
| :-------------- | :------------------- | :--------------------------------------- |
| `smtp_server`   | `SMTP_SERVER_HOST`   | `mailpit`                                |
| `smtp_port`     | `SMTP_SERVER_PORT`   | `1025`                                   |
| `sender_email`  | `SMTP_FROM_EMAIL`    | the class attribute `default_sender_email` |
| `smtp_username` | `SMTP_USERNAME`      | none, no login is performed              |
| `smtp_password` | `SMTP_PASSWORD`      | none                                     |
| `security`      | `SMTP_SECURITY`      | `none`, see below                        |

The service only logs in when a username is configured. If your SMTP server
requires authentication, you must set `SMTP_USERNAME` and `SMTP_PASSWORD`.

### Connection security

`SMTP_SECURITY` (or the `security` argument, an `SmtpSecurity` value) selects
how the connection is secured:

| Value      | Behaviour                                                            | Typical port |
| :--------- | :------------------------------------------------------------------- | :----------- |
| `none`     | Plain SMTP connection.                                               | 25, 1025     |
| `starttls` | Plain connection, upgraded to TLS with `STARTTLS` before logging in. | 587          |
| `ssl`      | Implicit TLS from the first byte (`SMTP_SSL`).                       | 465          |

The older boolean `SMTP_USE_TLS` is still supported for backwards
compatibility. `SMTP_USE_TLS=true` is equivalent to `SMTP_SECURITY=ssl`. When
both are set, `SMTP_SECURITY` takes precedence. An invalid `SMTP_SECURITY`
value raises a `ValueError` when the service is instantiated.

Example for a provider that uses implicit TLS:

```yaml
SMTP_SERVER_HOST: smtp.example.com
SMTP_SERVER_PORT: 465
SMTP_SECURITY: ssl
SMTP_FROM_EMAIL: no-reply@example.com
SMTP_USERNAME: <username>
SMTP_PASSWORD: <password>
```

## Base API

```python
from services.emails import BaseEmailService, SmtpSecurity
```

### `send_email(recipient_email, subject, email_html) -> bool`

Sends an HTML email to a single recipient. The service derives a plain-text
alternative from the HTML (links become `label: url`, tags and `<head>` /
`<style>` blocks are stripped) and sends both as a `multipart/alternative`
message, together with `Date` and `Message-ID` headers.

The method returns `True` when the message was handed to the SMTP server and
`False` when sending failed. Failures are logged as errors and never raised,
so a failing mail server does not break the request or queue handler that sends
the email. Check the return value if you need to track failed deliveries.

### `render_html_template(template_name, template_vars) -> str`

A class method that renders a Jinja template from the class's `template_dir`.
Autoescaping is enabled, so values in `template_vars` are HTML-escaped. Only
pass pre-rendered HTML through a variable if you mark it safe in the template.

`template_name` is a file name relative to `template_dir`. A `StrEnum` member
works as well, which is the recommended way to list a client's templates.

Because it is a class method, you can render a template without an instance,
for example to build a body once and send it to many recipients:

```python
html_body = MyClientEmailService.render_html_template(
    MyClientHtmlTemplateName.DIGEST, {"items": items}
)
```

### `send_template_email(recipient_email, subject, template_name, template_vars) -> bool`

Renders a template and sends it in one call. It is a shorthand for
`render_html_template` followed by `send_email`, and has the same return value.

## Templates

Templates are Jinja HTML files. By default the service loads them from
`/app/assets/html`, which is where a client's `assets` directory ends up in the
collection API container: the client's Dockerfile copies `assets` to
`/app/assets`, and the local docker-compose setup mounts it there.

```
client-collection-module/
└── assets/
    └── html/
        ├── _base_mail.html        # shared layout
        ├── _macros.html           # shared macros, e.g. a button
        └── welcome_mail.html      # {% extends "_base_mail.html" %}
```

Jinja's `{% extends %}`, `{% include %}`, and `{% import %}` resolve relative to
the same directory, so you can share a base layout and macros between emails.

To load templates from another location, override `template_dir` on your
subclass.

## Writing a client email service

A client service is a subclass of `BaseEmailService` that lives in the client's
collection module, for example `api/apps/<client>/services/emails/`. Keep the
base class free of client knowledge: the subclass declares its sender, its
templates, and one method per kind of email.

### 1. List the templates

```python
# api/apps/<client>/services/emails/constants.py
from enum import StrEnum


class MyClientHtmlTemplateName(StrEnum):
    WELCOME = "welcome_mail.html"
    DIGEST = "digest_mail.html"
```

### 2. Subclass the base service

Override class attributes instead of `__init__`:

| Class attribute        | Purpose                                                    | Default             |
| :--------------------- | :--------------------------------------------------------- | :------------------ |
| `default_sender_email` | Sender used when neither the argument nor `SMTP_FROM_EMAIL` is set. | `noreply@elody.eu`  |
| `template_dir`         | Directory the Jinja templates are loaded from.             | `/app/assets/html`  |

Then add one public method per email. Each method decides the subject, the
template, and the template variables, and delegates the rest to the base class:

```python
# api/apps/<client>/services/emails/email_service.py
from services.emails import BaseEmailService

from .constants import MyClientHtmlTemplateName


class MyClientEmailService(BaseEmailService):
    default_sender_email = "my-client-dev@elody.eu"

    def send_welcome_email(
        self, recipient_email: str, recipient_name: str, link: str
    ) -> bool:
        return self.send_template_email(
            recipient_email,
            f"Welcome to My Client, {recipient_name}",
            MyClientHtmlTemplateName.WELCOME,
            {"link": link},
        )

    def send_digest(self, recipient_email: str, html_body: str) -> bool:
        return self.send_email(recipient_email, "Your daily digest", html_body)
```

```python
# api/apps/<client>/services/emails/__init__.py
from .email_service import MyClientEmailService

__all__ = ["MyClientEmailService"]
```

### 3. Send emails

Instantiate the service where you need it. Without arguments, the service picks
up the SMTP configuration from the environment:

```python
from apps.my_client.services.emails import MyClientEmailService

email_service = MyClientEmailService()
if not email_service.send_welcome_email(user_email, user_name, redirect_uri):
    log.warning(f"Welcome email to {user_email} was not sent")
```

### Where to render the body

When the body depends only on the email type, render it inside the service
method with `send_template_email`, as in `send_welcome_email` above.

When the caller already knows more about the body than the service does, let
the caller render it and pass the HTML in. Podiumnet does this for update
notifications: a RabbitMQ queue handler chooses between a manual message, an
immediate update, and a daily or weekly digest, renders the matching template
once with `render_html_template`, and then calls
`send_update_notification(recipient_email, html_body, subject=...)` for each
recipient.

If the caller builds HTML from user input without a template, escape it first,
for example with `html.escape`.

## Local development with Mailpit

The local docker-compose setup includes Mailpit, which captures every email so
you can inspect it at `http://mailpit.localhost:8000`. The shared Mailpit
configuration requires implicit TLS and authentication, so the collection API
needs:

```yaml
environment:
  - SMTP_USE_TLS              # or SMTP_SECURITY=ssl, set in the client's .env
  - SMTP_SECURITY
  - SMTP_USERNAME=${SMTP_USERNAME:-dev}
  - SMTP_PASSWORD=${SMTP_PASSWORD:-dev}
```

Without a username the service does not log in, and Mailpit rejects the
message with an authentication error.

::: tip
Containers only read their environment when they are created. After you
change SMTP variables, recreate the collection API container, for example with
`docker compose up -d collection-api`.
:::

## Testing

Patch `smtplib` in the base module to test a service without an SMTP server.
The SMTP class is used as a context manager, so the server object is the
`__enter__` return value:

```python
from unittest.mock import patch

import pytest
from apps.my_client.services.emails import MyClientEmailService


@pytest.fixture
def smtp_server():
    with patch("services.emails.email_service.smtplib") as smtplib_mock:
        yield smtplib_mock.SMTP.return_value.__enter__.return_value


@pytest.fixture(autouse=True)
def local_templates(monkeypatch):
    # Templates live at /app/assets/html only inside the container
    monkeypatch.setattr(
        MyClientEmailService, "template_dir", "<path to client>/assets/html"
    )


def test_send_welcome_email(smtp_server):
    assert MyClientEmailService().send_welcome_email(
        "to@example.com", "Ann", "https://example.com"
    )

    message = smtp_server.send_message.call_args.args[0]
    assert message["Subject"] == "Welcome to My Client, Ann"
    assert 'href="https://example.com"' in message.get_body(("html",)).get_content()
```

Clear the `SMTP_*` environment variables in tests (for example with
`monkeypatch.delenv`) so a developer's local environment does not change the
outcome. The base service tests live in
`collection-api/api/tests/unit/services/test_email_service.py`, and Podiumnet's
in `api/apps/podiumnet/tests/test_email_service.py` in its collection module.

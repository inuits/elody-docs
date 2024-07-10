# Setting up a hosted elody dev instance

## Verify access to services

Before touching any code or pipelines, it's best to check that you have access to some resources.
To test this, you should open an `sshuttle`: `sshuttle --dns -r proxy03.inuits.io --to-ns 10.0.228.12 192.168.44.0/24 10.26.6.0/24 10.0.228.0/24`.
If this succeeds, that's already a got first step, because this means you are able to ssh into our infra.
If not, this probably means you will have to add your public ssh key to [freeipa](https://freeipa01.inuits.eu/ipa/ui/).
Please also follow [this guide](https://docs.inuits.io/procedures/ssh/ssh) and [this guide](https://docs.inuits.io/procedures/ssh/ssh_config/) to ensure access.

If the `sshuttle` is open you should be able to reach the following services:
* [Nomad](http://nomad.local.service.inuits.consul/ui/jobs?namespace=*)
* [Traefik](http://traefik-external.local.service.inuits.consul/dashboard/#/)
* [Vault](http://vault.local.service.inuits.consul/ui)

Credentials for both `Nomad` and `Traefik` can be found [here](http://vault.local.service.inuits.consul/ui/vault/secrets/inuits/show/container-infra/infra-nomad-jobs/ingress-internal/basic-auth)

The last one (Vault) requires a log-in. If the system notifies you about a lack of "roles", this probably means you are not assigned to the correct role in freeipa.
You should have the `dev` or `dailyops` role. You can ask dailyops to give you the correct roles.

If this all went successfully, we can move onto the next section.

## Preparing some resources

### MongoDB

An elody instance needs a db. In this guide, we will use mongo as an example.
A MongoDB instance can be created by adding a db to this [hiera repo](https://redmine.inuits.eu/projects/db-cluster/repository/db-cluster-hiera).
A reference implementation can be found [here](https://redmine.inuits.eu/projects/db-cluster/repository/db-cluster-hiera/revisions/8d77b6448a02c65aaa2eb5b3a775489ba7bd9e5a/diff).
The password you see in this commit should be at least 32 characters, containing upper- and lowercase alphabetic characters and numbers.
After this commit, the pipeline for this repo should do it's job and after 30 minutes at max (puppet runs every 30 minutes), you should have a MongoDB ready to be accessed.

### S3

We can use our ceph instance to create an S3 bucket/user that can be consumed by the storage-api.
This is nicely documented over [here](https://docs.inuits.io/services/ceph/?h=s3#creating-new-user-and-bucket).

### Repositories

For the project, at least a Consul and Terraform repo should exist.
Ideally these should also exist on redmine, so when referring to tickets, these are nicely linked by the mirror.

### Keycloak

A keycloak realm and clients should also be created.
This can be done in the following [repo](https://gitlab.inuits.io/inuits/keycloak/keycloak-puppet/keycloak-puppet-master).
You can use [this commit](https://gitlab.inuits.io/inuits/keycloak/keycloak-puppet/keycloak-puppet-master/-/commit/ea5e00b8c1b1802f87e7fbdfc72aef433bd4d63e) as a reference.

To test if the realm was created correctly, you can head over to the [keycloak management interface](https://keycloak01.keyprod.inuits.eu/admin/master/console).
To be able to reach this site, the same `sshuttle`-command as in the beginning of this guide can be use.
It could be however that you are not able to login, only keycloak admins can do this.
Either you ask someone with this privilege to check if everything went correctly, or you ask if you can get these permissions.

## Preparing environment

In this step, we will add some variables the services need, both in Vault and in Consul.

### Vault

Vault stores our secrets, and other credentials we don't want in a git repo.
This is a manual step unfortunately. The structure that can be found [here](http://vault.local.service.inuits.consul/ui/vault/secrets/digipolis/list/dams-v2/) should be copied over.
Some variables will have to be changed however to reflect the new environment.

### Consul

Consul is our key/value store, this stores urls to other services for example.
A reference commit showing how this should be filled in can be found [here](https://gitlab.inuits.io/customers/digipolis/dams-v2/digipolis-dams-v2-consul/-/commit/83a5fda53c007cb358436beab4702f9a2ce05cae).

## Configuring services

The last step is to configure our services that make up elody.
These services will run on Nomad, our container orchestrator and will be defined/managed in Terraform.
An example commit showing how the first service (rabbitmq) was created, can be found [here](https://gitlab.inuits.io/customers/digipolis/dams-v2/digipolis-dams-v2-terraform/-/commit/e3f80e55872beb2f6594f117ab5e48a12e45abd2).

### RabbitMQ

Deploying a RabbitMQ is a bit more of an involved process. There are a few steps to be taken:

#### Pin nomad client nodes on which the rabbit instances of the cluster will run

Because the nodes of the RabbitMQ cluster need a static port assigned, all the
nodes of the cluster need to run on seperate Nomad clients. This can be done by
adding a tag to three specific nomad clients. An example commit showing how this
can be achieved can be found [here](https://redmine.inuits.eu/projects/inuits-puppet-infra/repository/inuits-hiera-nomad/revisions/1b8bdcab8ffc015643853dc75682b661247d2200).
Do note that these changes aren't instant after the pipeline for this has ran.
Puppet runs every 30 minutes, so that's the time you should wait before continuing.

#### Assign some static ports for Rabbit to use

A static port will also have to be defined over which AMQP traffic can flow from
and to RabbitMQ. These static ports have to be defined both in Consul and in
Terraform. These changes take place in the Container Infra. This is an
[example commit](https://gitlab.inuits.io/inuits/container-infra/infra-nomad-consul/-/commit/0bb7fc63970c1d2a694e5c8d7f25f1a9c8431667)
for the changes that need to take place in Consul.

#### Create the actual jobs and configure them

When the previous steps were completed successfully. The last step is pretty
trivial. Some configuration for RabbitMQ has to be added to Consul, like you can
see [here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-consul/-/blob/master/common/rabbitmq?ref_type=heads),
[here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-consul/-/blob/master/common/common?ref_type=heads),
[here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-consul/-/blob/master/dev/common?ref_type=heads)
and [here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-consul/-/blob/master/dev/rabbitmq?ref_type=heads).
The Terraform configuration can be found [here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-terraform/-/tree/master/modules/rabbitmq?ref_type=heads),
[here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-terraform/-/blob/master/main.tf?ref_type=heads#L33)
and [here](https://gitlab.inuits.io/customers/vliz/vliz-dams/vliz-dams-terraform/-/blob/master/job.variables.tf?ref_type=heads#L23).

Do be carefull when configuring the service via Terraform that also here some
ports should be changed so that they are unique.

### Giving access to terraform from other repos

To have successfull pipelines you will also need to add a policy to vault using the [Vault CLI](https://developer.hashicorp.com/vault/install).
Configure Vault CLI to use the correct Vault instance:
```
export VAULT_ADDR=https://active.vault.service.inuits.consul:8200
export VAULT_SKIP_VERIFY=1
```

And login to Vault using:
```
vault login -method=oidc
```

Adding the policy can be done like so (VLIZ will be the example project here):

```
vault policy write vliz-dams-terraform -<<EOF
path "sys/policies/acl/*"{
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
path "sys/capabilities-self" {
  capabilities = ["update"]
}
path "auth/token/renew-self" {
  capabilities = ["update"]
}
path "auth/token/lookup-self" {
  capabilities = ["read"]
}
path "auth/token/create" {
  capabilities = ["create", "update"]
}
path "inuits/data/container-infra/*" {
  capabilities = ["read"]
}
path "inuits/metadata/container-infra/*" {
  capabilities = ["list"]
}
path "vliz/data/dams/*" {
  capabilities = ["read"]
}
path "vliz/metadata/dams/*" {
  capabilities = ["list"]
}
EOF
```

Next up is to link the policy to a JWT role.
```
vault write auth/jwt/role/vliz-dams-terraform - <<EOF
{
  "role_type": "jwt",
  "policies": ["vliz-dams-terraform"],
  "token_explicit_max_ttl": 60,
  "user_claim": "user_email",
  "bound_claims": {
    "project_path": "customers/vliz/vliz-dams/vliz-dams-terraform",
    "ref_type": "branch"
  }
}
EOF
```

The last step is to create roles for the different services. This way the
different services can communicate with the Terraform pipeline to deploy to
a dev environment for example (we will use the collection-api as an example here):
```
vault write auth/jwt/role/vliz-dams-collection - <<EOF
{
  "role_type": "jwt",
  "policies": ["vliz-dams-terraform"],
  "token_explicit_max_ttl": 60,
  "user_claim": "user_email",
  "bound_claims": {
    "project_path": "customers/vliz/vliz-dams/vliz-dams-collection",
    "ref_type": "branch"
  }
}
EOF
```

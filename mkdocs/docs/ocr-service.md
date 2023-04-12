# Technical implementation

The ocr-service is designed to work together with the collection-api, storage-api 
and the Rabbit queue's in order to OCR an existing image in the system. 
The OCR'ing itself is done by [Tesseract](https://tesseract-ocr.github.io/), an open source OCR tool made by Google.
The service is build with a [Flask api](https://flask.palletsprojects.com/en/2.2.x/) with one endpoint "/ocr" to execute an OCR job.
The user has to give the mediafile_id of the image (which is saved in the collection-api) that he wants to OCR. 
He also has to give the operation that he wants to execute. 
Possible operations: ['**txt**', '**alto**', '**pdf**']

At last it is also possible to give a language to the endpoint so 
the OCR function can be executed more precisely.
Possible languages: ['**eng**', '**nld**', '**fra**']


## How does an image get OCRed
1. The user makes a call to the endpoint **/ocr** with the correct body. 
You can find more information about this in the [swagger documentation](http://ocr-service.dams.localhost:8100/api/docs/) (when the api is started):
2. First of all the ocr-service checks if the given **mediafile_id** exists. Therefore, it
makes a call to the [collection-api](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-collection) to check. If the image does not exist,
the call is aborted with a 400 status code.
3. The image exists so the call continues and makes a **new mediafile** in the collection-api.
This is where the generated OCR output will be stored in later on.
4. A message is put on the **[Rabbit](https://www.rabbitmq.com/) queue** to execute an OCR job. The call gets termined with a 
positive response. The id of the newly created mediafile in step 3 is given to the user.
5. The ocr-service picks up a message from the AMQP queue to **execute an OCR job**.
   6. **Tesseract executes** an OCR method on the image.
   7. The output is **stored in the mediafile** by a post request to the [storage-api](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-storage) with the created mediafile(id).
8. The user can now call the collection-api with the returned mediafile_id in step 4 to **fetch the OCRed image**.



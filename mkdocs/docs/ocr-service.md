# Technical implementation

The ocr service is designed to work together with the collection api, storage api 
and the rabbit queue's in order to ocr an existing image in the system. 
The OCR'ing itself is done by Tesseract, an open source ocr tool made by Google.
The service is build with a flask api with one endpoint "/ocr" to execute an ocr job.
The user has to give the mediafile_id of the image (which is saved in the collection api) that he wants to ocr. 
He also has to give the operation that he wants to execute. 
Possible operations: ['**txt**', '**alto**', '**pdf**']

At last it is also possible to give a language to the endpoint so 
the ocr function can be executed more precisely.
Possible languages: ['**eng**', '**nld**', '**fra**']


## How does an image get OCRed
1. The user makes a call to the endpoint **/ocr** with the correct body. 
You can find more information about this in the swagger doc (when the api is started):

    http://ocr-service.dams.localhost:8100/api/docs/

2. First of all the ocr-service checks if the given **mediafile_id** exists. Therefore, it
makes a call to the collection api to check. If the image does not exist,
the call is aborted with a 400 status code.
3. The image exists so the call continues and makes a **new mediafile** in the collection api.
This is where the OCR output will be stored in later on.
4. A message is put on the **rabbit queue** to execute an OCR job. The call gets termined with a 
positive response. The id of the newly created mediafile in step 3 is given to the user.
5. The ocr-service picks up a message from the AMQP queue to **execute an OCR job**.
   6. **Tesseract executes** an OCR method on the image.
   7. The output is **stored in the mediafile** by a post request to the storage api with the created mediafile(id).
8. The user can now call the collection api with the returned mediafile_id in step 4 to **fetch the OCRed image**.



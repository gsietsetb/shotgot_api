#!/bin/bash
urlImg="http://d3d71ba2asa5oz.cloudfront.net/12014992/images/rebecca%20pewter%20underwired%20spacer%20moulded%20full%20cup%20bra%202024.jpg"
path="res/"

mkdir -p $path

#Clarifai
name="clarifai"

#onlyCurl
  #curl -X POST -H "Authorization: Bearer lXuI0QoRWfI9iKhzvVSOuLulOpRKfh" -H "Content-Type: application/json" -d '{  "inputs": [ { "data": { "image": {"url": "https://samples.clarifai.com/metro-north.jpg" }}  }  ]}' \
  #https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs 

#withTimings:
  curl -X POST -H "Authorization: Bearer lXuI0QoRWfI9iKhzvVSOuLulOpRKfh" -H "Content-Type: application/json" -d '{"inputs": [{"data": {"image": {"url": "http://d3d71ba2asa5oz.cloudfront.net/12014992/images/rebecca%20pewter%20underwired%20spacer%20moulded%20full%20cup%20bra%202024.jpg" }}  }  ]}' \
https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs -s -w "@curl-format.txt" -o $path"/"$name"_response.txt" > $path"/"$name"_time.txt"

echo "Clarifai done"

#===================================================================================================================
#Cloudsight:
name="cloudsight"
#onlyCurl
#curl -i -X POST -H "Authorization: CloudSight bq-pbxKLtdbnpnZ501zfkg" -F "image_request[remote_image_url]=http://d3d71ba2asa5oz.cloudfront.net/12014992/images/rebecca%20pewter%20underwired%20spacer%20moulded%20full%20cup%20bra%202024.jpg" -F "image_request[locale]=en-US" https://api.cloudsightapi.com/image_requests
#curl -i -H "Authorization: CloudSight bq-pbxKLtdbnpnZ501zfkg" https://api.cloudsightapi.com/image_responses/43rCnbrBe5ZGvBQAJV6j0Q

#withTimings:
curl -i -X POST -H "Authorization: CloudSight bq-pbxKLtdbnpnZ501zfkg" -F "image_request[remote_image_url]=http://d3d71ba2asa5oz.cloudfront.net/12014992/images/rebecca%20pewter%20underwired%20spacer%20moulded%20full%20cup%20bra%202024.jpg" -F "image_request[locale]=en-US" https://api.cloudsightapi.com/image_requests -s -w "@curl-format.txt" -o $path"/"$name"_response.txt" > $path"/"$name"_time.txt"
curl -i -H "Authorization: CloudSight bq-pbxKLtdbnpnZ501zfkg" https://api.cloudsightapi.com/image_responses/43rCnbrBe5ZGvBQAJV6j0Q -s -w "@curl-format.txt" -o $path"/"$name"_response2.txt" > $path"/"$name"_time2.txt"

echo "Cloudsight done"

#===================================================================================================================
#GoogleCloudVisionAPI
#onlyCurl for external Image (needs to be on google cloud GS://)
#curl -X POST -H 'Authorization: Bearer lXuI0QoRWfI9iKhzvVSOuLulOpRKfh' -H "Content-Type: application/json" -d '{ "requests": [
#    {"images": {"source": {"gcsImageUri": "http://thumbs4.ebaystatic.com/d/l225/m/m_PZ02FeyLmPDRH6e8QMzHQ.jpg" } },
#      "features": [{ "type": "IMAGE_PROPERTIES" } ]}]}' https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDsDvft_7Du_CD-5hN1pSN67GfZIlu7zbs 

curl -X POST -d '{"requests": [{"images": {"content": 
""
},"features": [{"type": "IMAGE_PROPERTIES"}]}]}' https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDsDvft_7Du_CD-5hN1pSN67GfZIlu7zbs 
echo "GoogleCloudVisionAPI done"
exit 1

#Blipar
  name="blipar"
  #getToken
  curl -X GET https://bauth.blippar.com/token?grant_type=client_credentials&client_id=4570465c05364e8f9b91281a74c447f3&client_secret=72ee8ca66b094abab82970955d045dee
  #RetrieveImg
  curl -X POST \
      -w "@curl-format.txt" \
      -s \
      -H 'Authorization: Bearer IpLPFJ9zSQWtvqTlwSJgwA' \
      -H "Content-Type: application/json" \
      -d '
      {
        "inputs": [
          {
            "data": {
              "image": {
                "url": $urlImg
              }
            }
          }
        ]
      }'\
      https://bapi.blippar.com/v1/imageLookup  > $path$name/times.txt

  curl -X POST \
      -H 'Authorization: Bearer IpLPFJ9zSQWtvqTlwSJgwA' \
      -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryzeZR8KqAYJyI2jPL" \
           https://bapi.blippar.com/v1/imageLookup?input_image=http://d3d71ba2asa5oz.cloudfront.net/12014992/images/rebecca%20pewter%20underwired%20spacer%20moulded%20full%20cup%20bra%202024.jpg

echo "Blipar done"



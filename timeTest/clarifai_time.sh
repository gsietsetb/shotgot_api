#!/bin/bash
urlImg="http://d3d71ba2asa5oz.cloudfront.net/12014992/images/rebecca%20pewter%20underwired%20spacer%20moulded%20full%20cup%20bra%202024.jpg"
path="res/"

mkdir -p $path

#Clarifai
name="clarifai"

curl -s -X POST \
-w "@curl-format.txt" \
-H "Authorization: Bearer lXuI0QoRWfI9iKhzvVSOuLulOpRKfh" \
-H "Content-Type: application/json" \
-o $path"/"$name"_response.txt" \
-d '
{
  "inputs": [
  {
    "data": {
      "image": {
        "url": "https://samples.clarifai.com/metro-north.jpg"
      }
    }
  }
  ]
}' \
https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs > $path"/"$name"_time.txt"

echo "Clarifai done"

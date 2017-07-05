import requests as req
import csv
import geocoder

request = req.get('https://thecountedapi.com/api/counted')
results = request.json()

str = results[0]['address'] + ', ' + results[0]['state']
print str
g = geocoder.google(str)
print g.latlng

#for result in results:
	#str = result['address'] + ', ' + result['state']
	#geocoder.google(str)

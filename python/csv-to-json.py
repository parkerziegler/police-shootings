import csv
import json

csv2015 = open('the-counted-2015.csv', 'r')
csv2016 = open('the-counted-2016.csv', 'r')
jsonfile = open('shootings-data.json', 'w')

fieldnames = ("uid", "name", "age", "gender", "raceethnicity", "month", "day", "year", "streetaddress", "city", "state", "classification", "lawenforcementagency", "armed")

reader2015 = csv.DictReader(csv2015, fieldnames)
next(reader2015, None)
for row in reader2015:
    json.dump(row, jsonfile)

reader2016 = csv.DictReader(csv2016, fieldnames)
next(reader2015, None)
for row in reader2016:
    json.dump(row, jsonfile)
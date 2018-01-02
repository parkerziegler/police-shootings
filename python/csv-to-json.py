# import csv
# import json

# csv2015 = open('the-counted-2015.csv', 'r')
# csv2016 = open('the-counted-2016.csv', 'r')
# jsonfile = open('shootings-data.json', 'w')

# fieldnames = ("uid", "name", "age", "gender", "raceethnicity", "month", "day", "year", "streetaddress", "city", "state", "classification", "lawenforcementagency", "armed")

# reader2015 = csv.DictReader(csv2015, fieldnames)
# next(reader2015, None)
# out2015 = json.dumps([row for row in reader2015])

# reader2016 = csv.DictReader(csv2016, fieldnames)
# next(reader2015, None)
# out2016 = json.dumps([row for row in reader2016])
# out = out2015 + out2016
# jsonfile.write(out)

import csv
import json
import pandas as pd

data2015 = pd.read_csv('the-counted-2015.csv', sep=",")
data2016 = pd.read_csv('the-counted-2016.csv', sep=",")
data = data2015.append(data2016)
data.to_json('../public/shootings-data.json', orient="records")

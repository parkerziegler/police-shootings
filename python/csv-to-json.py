import pandas as pd

data2015 = pd.read_csv('the-counted-2015.csv', sep=",")
data2016 = pd.read_csv('the-counted-2016.csv', sep=",")
data = data2015.append(data2016)
data.to_json('../public/shootings-data.json', orient="records")

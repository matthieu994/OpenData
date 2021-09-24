#!/usr/bin/env python
import csv
import pandas as pd

# === REDUCTION DU FICHIER CARACTERISTIQUES-2019.CSV

data = pd.read_csv('caracteristiques-2019-test.csv')
  
# drop function which is used in removing or deleting rows or columns from the CSV files
data.drop('adr', inplace=True, axis=1)

data.drop('jour', inplace=True, axis=1)

data.drop('mois', inplace=True, axis=1)

data.drop('an', inplace=True, axis=1)

data.drop('lum', inplace=True, axis=1)

data.drop('com', inplace=True, axis=1)

data.drop('agg', inplace=True, axis=1)

data.drop('int', inplace=True, axis=1)

data.drop('atm', inplace=True, axis=1)

data.drop('col', inplace=True, axis=1)

f = open("caracteristiques-2019-trimmed.csv", "w")
f.write(data.to_csv(index=False))
f.close()

# === REDUCTION DU FICHIER POPULATION.CSV

data = pd.read_csv('population.csv')
  
# drop function which is used in removing or deleting rows or columns from the CSV files
data.drop('NB_ARRONDS', inplace=True, axis=1)

data.drop('NB_CANTONS', inplace=True, axis=1)

data.drop('NB_COMMUNES', inplace=True, axis=1)

f = open("population-trimed.csv", "w")
f.write(data.to_csv(index=False))
f.close()


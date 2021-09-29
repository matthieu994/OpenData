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

data.drop('agg', inplace=True, axis=1)

data.drop('int', inplace=True, axis=1)

data.drop('atm', inplace=True, axis=1)

data.drop('col', inplace=True, axis=1)

f = open("caracteristiques-2019-trimmed.csv", "w")
f.write(data.to_csv(index=False))
f.close()

# === SOMME PAR DEPARTEMENT

accident_file = open('caracteristiques-2019-trimmed.csv', 'r')
first_line = accident_file.readline().strip().split(',')
i = 0
index_dep = i

while i < len(first_line):
    if first_line[i] == "dep":
        index_dep = i
    i += 1

nb_accidents = [0 for i in range(95)]

while True:
    line = accident_file.readline().strip().split(',')
    if (not line) or (line == ['']):
        break

    num_dep = line[index_dep]
    if num_dep.isdigit():
        if int(num_dep) < 96:
            nb_accidents[int(num_dep) - 1] += 1

accident_file.close()

# === REDUCTION DU FICHIER POPULATION.CSV ET AJOUT DU NOMBRE D'ACCIDENTS

data = pd.read_csv('population.csv')

# drop function which is used in removing or deleting rows or columns from the CSV files
data.drop('NB_ARRONDS', inplace=True, axis=1)

data.drop('NB_CANTONS', inplace=True, axis=1)

data.drop('NB_COMMUNES', inplace=True, axis=1)

f = open("population-trimmed.csv", "w")
f.write(data.to_csv(index=False))
f.close()

input_pop_file = open("population-trimmed.csv", "r")
output_pop_file = open("population-summed.csv", "w")

first_line = input_pop_file.readline().strip()
first_line_split = first_line.split(',')
i = 0
index_dep = i

while i < len(first_line_split):
    if first_line_split[i] == "CODE_DEPT":
        index_dep = i
    i += 1

output_pop_file.write(first_line + "," + "NB_ACCIDENTS\n")

while True:
    line = input_pop_file.readline().strip()

    if (not line) or (line == ['']):
        break

    line_split = line.split(',')
    dep_number = line_split[index_dep]
    dep_nb_accidents = 0
    if dep_number.isdigit():
        if int(dep_number) < 96:
            dep_nb_accidents = nb_accidents[int(dep_number) - 1]
    output_pop_file.write(line + "," + str(dep_nb_accidents) + "\n")

input_pop_file.close()
output_pop_file.close()

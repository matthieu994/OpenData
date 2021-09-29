import csv

def getAccidentIdsWithinDepartement(no_departement):
	accident_id_column = 0
	departement_no_column = 6

	with open('caracteristiques-2019.csv', 'r', encoding="utf-8") as f:
		reader = csv.reader(f)
		
		accident_ids_within_departement = []
		
		for row in reader:
			if (len(row) < departement_no_column):
				continue
				
			current_row_departement_no = row[departement_no_column]
			if (current_row_departement_no == no_departement):
				accident_ids_within_departement.append(row[accident_id_column])
				
	return accident_ids_within_departement;

def getAccidentSpeedLimit(accident_id, reader):
	accident_id_column = 0
	speed_limit_column = 17
	
	for row in reader:
		if (len(row) < accident_id_column):
			continue
		
		if (row[accident_id_column][1:-1] == accident_id):
			return row[speed_limit_column][1:-1]
		
def generateVmaDataForDepartement(no_departement):
	per_speed_accident_count = { "50" : 0, "80" : 0, "90" : 0, "110" : 0, "130" : 0 }
	
	with open('lieux-2019.csv', 'r', encoding="utf-8") as f:
		reader = csv.reader(f, delimiter=';', quotechar='|')
		for accident_id in getAccidentIdsWithinDepartement(no_departement):
			accident_speed_limit = getAccidentSpeedLimit(accident_id, reader)
			
			if accident_speed_limit in per_speed_accident_count:
				per_speed_accident_count[accident_speed_limit] += 1

	return [
		no_departement, 
		per_speed_accident_count["50"],
		per_speed_accident_count["80"] + per_speed_accident_count["90"],
		per_speed_accident_count["110"], 
		per_speed_accident_count["130"]
	]

def sum_data(d1, d2):
	result = { "50" : 0, "80to90" : 0, "110" : 0, "130" : 0 }
	result["50"] = d1[1] + d2["50"]
	result["80to90"] = d1[2] + d2["80to90"]
	result["110"] = d1[3] + d2["110"]
	result["130"] = d1[4] + d2["130"]
	return result

def generateVmaData():
	with open('vmaData.csv', 'w', encoding="utf-8", newline='') as csvfile:
		filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
		filewriter.writerow(['Departement', '50kmh', '80-90kmh', '110kmh', '130kmh'])
		
		whole_france_data = { "50" : 0, "80to90" : 0, "110" : 0, "130" : 0 }
		for no_departement in range(1, 96):
			departement_data = generateVmaDataForDepartement(str(no_departement))
			whole_france_data = sum_data(departement_data, whole_france_data)
			filewriter.writerow(departement_data)
			print(str(no_departement) + " ajouté")
			
		filewriter.writerow(['all', whole_france_data["50"], whole_france_data["80to90"], whole_france_data["110"], whole_france_data["130"]])
		
if __name__ == "__main__":
	generateVmaData()
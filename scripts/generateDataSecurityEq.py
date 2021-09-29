import pandas as pd
import os
import json


# Functions
def equipement(sec1, sec2, sec3):
    if (sec1 == 0):
        return "Aucun"
    if (sec1 == -1 or sec1 == 8):
        return "Non determinable/Non renseigne"
    else:
        eq = []
        if (sec1 != -1 and sec1 != 8 and sec1 != 0):
            eq.append(type_equip[sec1])
        if (sec2 != -1 and sec2 != 8 and sec2 != 0):
            eq.append(type_equip[sec2])
        if (sec3 != -1 and sec3 != 8 and sec3 != 0):
            eq.append(type_equip[sec3])
        return eq


def typeVehicule(vehicule):
    if (vehicule == "Velo"):
        return 'bikeSeverity'
    elif (vehicule == "Moto"):
        return 'motoSeverity'
    elif (vehicule == "Voiture"):
        return 'carSeverity'
    elif (vehicule == "EDP"):
        return 'edpSeverity'
    elif (vehicule == "Poids Lourd"):
        return 'heavyVehiclesSeverity'
    else:
        return 'otherVehiclesSeverity'


# CSV to JSON
csvCaracteristicas = "caracteristiques-2019.csv"
csvVeiculo = "vehicules-2019.csv"
csvPessoas = "usagers-2019.csv"

df = pd.read_csv(csvCaracteristicas, sep=';', decimal=',')[["Num_Acc", "dep"]]
df1 = pd.read_csv(csvVeiculo, sep=';', decimal=',')[["Num_Acc", "id_vehicule", "catv"]]
df2 = pd.read_csv(csvPessoas, sep=';', decimal=',')[["Num_Acc", "id_vehicule", "grav", "secu1", "secu2", "secu3"]]

df.to_json("c.json", orient="records")
df1.to_json("v.json", orient="records")
df2.to_json("p.json", orient="records")
caracteristicas = "c.json"
veiculo = "v.json"
pessoas = "p.json"
saida = {}
# Types of vehicules in the DataBase
type_vehic = [
    "Autres", "Velo", "Moto", "Voiture", "Autres", "Autres", "Autres", "Voiture", "Autres", "Autres",
    "Vehicule Utilitaire", "Autres", "Autres", "Poids Lourd", "Poids Lourd", "Poids Lourd", "Tracteur", "Tracteur",
    "Autres", "Autres", "Tracteur", "Tracteur", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres",
    "Autres", "Moto", "Moto", "Moto", "Moto", "Moto", "Quadricycle", "Quadricycle", "Bus", "Bus", "Train/Tram",
    "Train/Tram", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "EDP",
    "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "EDP", "Autres", "Autres",
    "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres",
    "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Velo", "Autres", "Autres", "Autres", "Autres",
    "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres", "Autres",
    "Autres", "Autres", "Autres", "Autres"
]
# Types of vehicules in the DataBase
type_equip = [
    "Aucun equipement", "Ceinture", "Casque", "Dispositif enfants", "Gilet reflechissant", "Airbag", "Gants",
    "Airbag + Gants", "Non determinable", "Autre"
]

#Select keys from json
with open(veiculo) as json_file:
    data = json.load(json_file)
    for row in data:
        if (row["Num_Acc"] in saida.keys()):
            if (row["id_vehicule"] in saida[row["Num_Acc"]].keys()):
                saida[row["Num_Acc"]][row["id_vehicule"]]["type vehicule"] = type_vehic[row["catv"]]
            else:
                saida[row["Num_Acc"]][row["id_vehicule"]] = {"usagers": [], "type vehicule": type_vehic[row["catv"]]}
        else:
            saida[row["Num_Acc"]] = {row["id_vehicule"]: {"usagers": [], "type vehicule": type_vehic[row["catv"]]}}
os.remove(veiculo)

with open(pessoas) as json_file:
    data = json.load(json_file)
    for row in data:
        saida[row["Num_Acc"]][row["id_vehicule"]]["usagers"].append({
            "gravite":
            row["grav"],
            "equipement":
            equipement(row["secu1"], row["secu2"], row["secu3"])
        })
os.remove(pessoas)

with open(caracteristicas) as json_file:
    data = json.load(json_file)
    for row in data:
        saida[row["Num_Acc"]]["departement"] = row["dep"]
os.remove(caracteristicas)

for acidente in saida.keys():
    i = 0
    chaves = saida[acidente].copy().keys()
    for veiculos in chaves:
        if veiculos != "departement":
            saida[acidente]["vehicule " + str(i + 1)] = saida[acidente].pop(veiculos)
            i += 1

departaments = [
    '1', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '2', '21', '22', '23', '24', '25', '26', '27',
    '28', '29', '2A', '2B', '3', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '4', '40', '41', '42',
    '43', '44', '45', '46', '47', '48', '49', '5', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '6',
    '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '7', '70', '71', '72', '73', '74', '75', '76', '77',
    '78', '79', '8', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '9', '90', '91', '92', '93', '94',
    '95', '971', '972', '973', '974', '975', '976', '977', '978', '986', '987', '988', 'all'
]

accidents = {}
for dept in departaments:
    accidents[dept] = {
        "bikeSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "motoSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "carSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "edpSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "heavyVehiclesSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "otherVehiclesSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "allVehiclesSeverity": {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            'tot': 0
        },
        "bike": {
            "helmet": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "others": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "nothing": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            }
        },
        "moto": {
            "helmet+gloves": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "helmet": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "nothing": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "others": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            }
        },
        "car": {
            "belt+airbags": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "belt": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "nothing": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "others": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            }
        },
        "edp": {
            "helmet": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "others": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "nothing": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            }
        },
        "poidsLourd": {
            "belt": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "others": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            },
            "nothing": {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                'tot': 0
            }
        },
    }

for keyAcidentes in saida.keys():
    for keyVeiculos in saida[keyAcidentes].keys():
        if (keyVeiculos != "departement"):
            for usager in saida[keyAcidentes][keyVeiculos]['usagers']:
                accidents[saida[keyAcidentes]['departement']][typeVehicule(
                    saida[keyAcidentes][keyVeiculos]["type vehicule"])][str(usager['gravite'])] += 1
                accidents[saida[keyAcidentes]['departement']][typeVehicule(
                    saida[keyAcidentes][keyVeiculos]["type vehicule"])]['tot'] += 1
                accidents[saida[keyAcidentes]['departement']]['allVehiclesSeverity'][str(usager['gravite'])] += 1
                accidents[saida[keyAcidentes]['departement']]['allVehiclesSeverity']['tot'] += 1
                # All departaments
                accidents['all'][typeVehicule(saida[keyAcidentes][keyVeiculos]["type vehicule"])][str(
                    usager['gravite'])] += 1
                accidents['all'][typeVehicule(saida[keyAcidentes][keyVeiculos]["type vehicule"])]['tot'] += 1
                accidents['all']['allVehiclesSeverity'][str(usager['gravite'])] += 1
                accidents['all']['allVehiclesSeverity']['tot'] += 1
                if saida[keyAcidentes][keyVeiculos]["type vehicule"] == "Velo":
                    if "Casque" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["bike"]["helmet"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["bike"]["helmet"]['tot'] += 1
                        # All departaments
                        accidents['all']["bike"]["helmet"][str(usager['gravite'])] += 1
                        accidents['all']["bike"]["helmet"]['tot'] += 1
                    elif "Aucun" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["bike"]["nothing"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["bike"]["nothing"]['tot'] += 1
                        # All departaments
                        accidents['all']["bike"]["nothing"][str(usager['gravite'])] += 1
                        accidents['all']["bike"]["nothing"]['tot'] += 1
                    else:
                        accidents[saida[keyAcidentes]['departement']]["bike"]["others"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["bike"]["others"]['tot'] += 1
                        # All departaments
                        accidents['all']["bike"]["others"][str(usager['gravite'])] += 1
                        accidents['all']["bike"]["others"]['tot'] += 1
                elif saida[keyAcidentes][keyVeiculos]["type vehicule"] == "Moto":
                    if "Casque" in usager["equipement"] and "Gants" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["moto"]["helmet+gloves"][str(
                            usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["moto"]["helmet+gloves"]['tot'] += 1
                        # All departaments
                        accidents['all']["moto"]["helmet+gloves"][str(usager['gravite'])] += 1
                        accidents['all']["moto"]["helmet+gloves"]['tot'] += 1
                    elif "Casque" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["moto"]["helmet"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["moto"]["helmet"]['tot'] += 1
                        # All departaments
                        accidents['all']["moto"]["helmet"][str(usager['gravite'])] += 1
                        accidents['all']["moto"]["helmet"]['tot'] += 1
                    elif "Aucun" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["moto"]["nothing"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["moto"]["nothing"]['tot'] += 1
                        # All departaments
                        accidents['all']["moto"]["nothing"][str(usager['gravite'])] += 1
                        accidents['all']["moto"]["nothing"]['tot'] += 1
                    else:
                        accidents[saida[keyAcidentes]['departement']]["moto"]["others"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["moto"]["others"]['tot'] += 1
                        # All departaments
                        accidents['all']["moto"]["others"][str(usager['gravite'])] += 1
                        accidents['all']["moto"]["others"]['tot'] += 1
                elif saida[keyAcidentes][keyVeiculos]["type vehicule"] == "Voiture":
                    if "Ceinture" in usager["equipement"] and "Airbag" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["car"]["belt+airbags"][str(
                            usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["car"]["belt+airbags"]['tot'] += 1
                        # All departaments
                        accidents['all']["car"]["belt+airbags"][str(usager['gravite'])] += 1
                        accidents['all']["car"]["belt+airbags"]['tot'] += 1
                    elif "Ceinture" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["car"]["belt"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["car"]["belt"]['tot'] += 1
                        # All departaments
                        accidents['all']["car"]["belt"][str(usager['gravite'])] += 1
                        accidents['all']["car"]["belt"]['tot'] += 1
                    elif "Aucun" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["car"]["nothing"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["car"]["nothing"]['tot'] += 1
                        # All departaments
                        accidents['all']["car"]["nothing"][str(usager['gravite'])] += 1
                        accidents['all']["car"]["nothing"]['tot'] += 1
                    else:
                        accidents[saida[keyAcidentes]['departement']]["car"]["others"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["car"]["others"]['tot'] += 1
                        # All departaments
                        accidents['all']["car"]["others"][str(usager['gravite'])] += 1
                        accidents['all']["car"]["others"]['tot'] += 1
                elif saida[keyAcidentes][keyVeiculos]["type vehicule"] == "EDP":
                    if "Casque" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["edp"]["helmet"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["edp"]["helmet"]['tot'] += 1
                        # All departaments
                        accidents['all']["edp"]["helmet"][str(usager['gravite'])] += 1
                        accidents['all']["edp"]["helmet"]['tot'] += 1
                    elif "Aucun" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["edp"]["nothing"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["edp"]["nothing"]['tot'] += 1
                        # All departaments
                        accidents['all']["edp"]["nothing"][str(usager['gravite'])] += 1
                        accidents['all']["edp"]["nothing"]['tot'] += 1
                    else:
                        accidents[saida[keyAcidentes]['departement']]["edp"]["others"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["edp"]["others"]['tot'] += 1
                        # All departaments
                        accidents['all']["edp"]["others"][str(usager['gravite'])] += 1
                        accidents['all']["edp"]["others"]['tot'] += 1
                elif saida[keyAcidentes][keyVeiculos]["type vehicule"] == "Poids Lourd":
                    if "Ceinture" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["poidsLourd"]["belt"][str(usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["poidsLourd"]["belt"]['tot'] += 1
                        # All departaments
                        accidents['all']["poidsLourd"]["belt"][str(usager['gravite'])] += 1
                        accidents['all']["poidsLourd"]["belt"]['tot'] += 1
                    elif "Aucun" in usager["equipement"]:
                        accidents[saida[keyAcidentes]['departement']]["poidsLourd"]["nothing"][str(
                            usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["poidsLourd"]["nothing"]['tot'] += 1
                        # All departaments
                        accidents['all']["poidsLourd"]["nothing"][str(usager['gravite'])] += 1
                        accidents['all']["poidsLourd"]["nothing"]['tot'] += 1
                    else:
                        accidents[saida[keyAcidentes]['departement']]["poidsLourd"]["others"][str(
                            usager['gravite'])] += 1
                        accidents[saida[keyAcidentes]['departement']]["poidsLourd"]["others"]['tot'] += 1
                        # All departaments
                        accidents['all']["poidsLourd"]["others"][str(usager['gravite'])] += 1
                        accidents['all']["poidsLourd"]["others"]['tot'] += 1

with open('securityequipements.json', 'w', encoding='utf-8') as fp:
    json.dump(accidents, fp)

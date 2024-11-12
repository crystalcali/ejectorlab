# main.py
from flask import Flask, render_template, request, jsonify
from modules.gdac import CalcEjector
from modules.waterair import WaterAirEjector
import os
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate_water_air', methods=['POST'])
def calculate_water_air():
    data = request.json
    try:
        G_air = float(data.get('G_air', 0.5))
        P_water = float(data.get('P_water', 200))
        P_air = float(data.get('P_air', 100))
        T_water = float(data.get('T_water', 20))
        T_air = float(data.get('T_air', 25))
        choice = data.get('choice', 'Выберите параметр')

        uo = float(data.get('uo', 0)) if data.get('uo') else None
        Pc = float(data.get('Pc', 0)) if data.get('Pc') else None

        ejector = WaterAirEjector(G_air, P_water, P_air, T_water, T_air, Pc, uo, choice)
        results = ejector.calculate_parameters()

        return jsonify({"status": "success", "results": results})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/calculate_gas_ejector', methods=['POST'])
def calculate_gas_ejector():
    data = request.json
    try:
        # Извлечение данных из запроса
        Gr = float(data.get('Gr', 0.0167))
        Gi = float(data.get('Gi', 0.00464))
        Pr = float(data.get('Pr', 11500000))
        Pi = float(data.get('Pi', 3800000))
        Tr = float(data.get('Tr', 468))
        Ti = float(data.get('Ti', 483))
        Rr = float(data.get('Rr', 287))
        Ri = float(data.get('Ri', 461))
        kr = float(data.get('kr', 1.4))
        ki = float(data.get('ki', 1.4))
        state_model_r = data.get('state_model_r', 'ideal gas')
        state_model_i = data.get('state_model_i', 'ideal gas')

        ejector = CalcEjector(
            Gr=Gr, Gi=Gi, Pr=Pr, Pi=Pi, Tr=Tr, Ti=Ti,
            Rr=Rr, Ri=Ri, kr=kr, ki=ki,
            state_model_r=state_model_r,
            state_model_i=state_model_i
        )
        lambda_values = np.linspace(0.1, 0.999, 50)
        results = ejector.optimize_psa(lambda_values)

        return jsonify({"status": "success", "results": results})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    # Убедитесь, что Flask запускается на доступном хосте и порту
    app.run()

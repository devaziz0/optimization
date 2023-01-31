from flask import Flask, request, jsonify
import logging
from server.optimization import efficient, naive, stats
from server.utils import generate_random_list, generate_test_data
app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker</h2>'


@app.route('/optimize/efficient/', methods=["GET"])
def optimize_efficient():
    args = request.args

    test_lists,quotient = generate_test_data(args)

    mean_time = efficient(test_lists, quotient)[0]
    response = jsonify({"mean_time": mean_time})
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


@app.route('/optimize/naive/', methods=["GET"])
def optimize_naive():
    args = request.args

    test_lists,quotient = generate_test_data(args)

    mean_time = naive(test_lists, quotient)[0]
    response = jsonify({"mean_time": mean_time})
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


@app.route('/benchmark/efficient/', methods=["GET"])
def benchmark_efficient():
    args = request.args
    repetition = args.get("repetition", default=1, type=int)
    num_lists = args.get("num_lists", default=1, type=int)
    num_elements = args.get("num_elements", default=1, type=int)
    mean_time = stats(num_lists,num_elements,repetition,efficient)
    return jsonify({"mean_time": mean_time})


@app.route('/benchmark/naive/', methods=["GET"])
def benchmark_naive():
    args = request.args
    repetition = args.get("repetition", default=1, type=int)
    num_lists = args.get("num_lists", default=1, type=int)
    num_elements = args.get("num_elements", default=1, type=int)
    mean_time = stats(num_lists,num_elements,repetition,naive)
    return jsonify({"mean_time": mean_time})

@app.route('/benchmark/compare/', methods=["GET"])
def benchmark_compare():
    args = request.args

    num_lists_sample = [5,10,15,20,25]
    num_elements = args.get("num_elements", default=1, type=int)

    args = request.args
    repetition = args.get("repetition", default=1, type=int)
    
    efficient_benchmark = []
    naive_benchmark = []
    for num_lists in num_lists_sample:
        mean_naive_time = stats(num_lists,num_elements,repetition,naive)
        mean_efficient_time = stats(num_lists,num_elements,repetition,efficient)

        naive_benchmark.append(mean_naive_time)
        efficient_benchmark.append(mean_efficient_time)

    benchmark_data = {"efficient":efficient_benchmark,"naive":naive_benchmark}
    response = jsonify(benchmark_data)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(debug=True)

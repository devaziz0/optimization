import json
from server.optimization import efficient, naive, stats
from server.app import app  # Flask instance of the API


def test_naive_method():
    lists = [[5, 4], [7, 8, 9], [5, 7, 8, 9, 10]]
    m = 40

    assert naive(lists, m)[1] == 37


def test_efficient_method():
    lists = [[5, 4], [7, 8, 9], [5, 7, 8, 9, 10]]
    m = 40

    assert efficient(lists, m)[1] == 37


def test_stats_naive():
    mean_time = stats(5, 5, 3, naive)

    assert mean_time > 0


def test_stats_efficient():
    mean_time = stats(5, 5, 3, efficient)

    assert mean_time > 0


def test_index_route():
    response = app.test_client().get('/')

    assert response.status_code == 200
    assert response.data.decode(
        'utf-8') == '<h1>Hello from Flask & Docker</h2>'


def test_efficient_route():
    response = app.test_client().get('/optimize/efficient/')

    res = json.loads(response.data.decode('utf-8'))
    assert type(res) is dict
    assert res["mean_time"] > 0
    assert response.status_code == 200


def test_naive_route():
    response = app.test_client().get('/optimize/naive/')

    res = json.loads(response.data.decode('utf-8'))
    assert type(res) is dict
    assert res["mean_time"] > 0
    assert response.status_code == 200


def test_naive_benchmark_route():
    response = app.test_client().get('/benchmark/naive/')

    res = json.loads(response.data.decode('utf-8'))
    assert type(res) is dict
    assert res["mean_time"] > 0
    assert response.status_code == 200


def test_efficient_benchmark_route():
    response = app.test_client().get('/benchmark/efficient/')

    res = json.loads(response.data.decode('utf-8'))
    assert type(res) is dict
    assert res["mean_time"] > 0
    assert response.status_code == 200


def test_compare_route():
    response = app.test_client().get('/benchmark/compare/?num_elements=5')

    res = json.loads(response.data.decode('utf-8'))
    assert type(res) is dict
    assert len(res["efficient"]) == 5
    assert len(res["naive"]) == 5
    assert response.status_code == 200

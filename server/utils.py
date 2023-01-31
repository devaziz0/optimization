import random
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_random_list(num_lists,num_elements):
    max_num = 10**9
    tests_list = []

    for i in range(num_lists):
            tests_list.append(random.sample(range(1, max_num), num_elements))

    return tests_list

def generate_test_data(args):
    num_lists = args.get("num_lists", default=1, type=int)
    num_elements = args.get("num_elements", default=1, type=int)
    quotient = args.get("quotient", default=1, type=int)

    test_lists = generate_random_list(num_lists, num_elements)

    return test_lists,quotient

def thread_test_run(results,i,tests_list,method,m):
    results[i] = method(tests_list, m)[0]

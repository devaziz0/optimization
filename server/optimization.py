import itertools
import random
import threading
import time

from server.utils import generate_random_list, thread_test_run


def naive(lists, m):
    """
    :param lists: List of lists with values to choose from.
    :param m: Quotient of modulo operator.
    :return: Maximum

    This method will check all the combinations of the list elements until it finds the maximum element
    which is m-1, we made it stop when it finds m-1 otherwise it would take a long time as lists grow.
    """
    max_mod = []
    max_rest = m-1
    st = time.time()
    lists_max = 0
    for x in itertools.product(*lists):
        max_mod.append(sum(list(map(lambda y: y**2, x))) % m)
        if max(max_mod) == max_rest:
            break
    lists_max = max(max_mod)
    et = time.time()
    return et - st,lists_max


def efficient(lists, m):
    """
    :param lists: List of lists with values to choose from.
    :param m: Quotient of modulo operator.
    :return: Maximum

    This method will first evaluate list_elemnt**2 % m and remove from each list the dupilcate elements 
    which would be redudent when looking for the max value, then we would check the remaining combinations 
    until we find the max value.

    """
    working_lists = []
    st = time.time()
    lists_max = 0

    for num_list in lists:

        mod_list = list(map(lambda y: (y**2) % m, num_list))

        mod_list = list(set(mod_list))
        working_lists.append(mod_list)
    max_mod = []
    max_rest = m-1
    for combo in itertools.product(*working_lists):
        combo_max = sum(combo) % m

        max_mod.append(sum(combo) % m)
        if combo_max == max_rest:
            break
    lists_max = max(max_mod)
    
    et = time.time()
    return et - st,lists_max




def stats(num_lists, num_elements, replications, method):

    m = random.randint(1000,5000)
    threads = [None] * replications
    results = [0] * replications

    for i in range(replications):
        tests_list = generate_random_list(num_lists,num_elements)
        thread = threading.Thread(target=thread_test_run,args=(results,i,tests_list,method,m))
        threads[i] = thread
        thread.start()
    
    for i in range(len(threads)):
        threads[i].join()        
    
    return sum(results)/len(results)


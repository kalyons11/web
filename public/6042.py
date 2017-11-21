"""
Kevin Lyons
https://kevinalyons.com
"""


import itertools
import sys

DICE = list(range(1, 7))


def gen():
    # Need to generate all possible combinations of A, B and C
    count = 0
    count_before = 0
    for a_len in range(1, 6):
        for a in itertools.combinations(DICE, a_len):
            a = set(a)
            for b_len in range(1, 6):
                for b in itertools.combinations(DICE, b_len):
                    b = set(b)
                    for c_len in range(1, 6):
                        for c in itertools.combinations(DICE, c_len):
                            c = set(c)
                            pr_a = len(a) / 6
                            pr_b = len(b) / 6
                            pr_c = len(c) / 6
                            total = a.intersection(b).intersection(c)
                            a_b = a.intersection(b)
                            a_c = a.intersection(c)
                            b_c = b.intersection(c)
                            pr_total = len(total) / 6
                            if pr_total == pr_a * pr_b * pr_c:
                                # Now, check independence
                                pr_a_given_b = len(a_b) / pr_b
                                pr_a_given_c = len(a_c) / pr_c
                                pr_b_given_c = len(b_c) / pr_c
                                if pr_a_given_b == pr_a:
                                    break
                                if pr_a_given_c == pr_a:
                                    break
                                if pr_b_given_c == pr_b:
                                    break
                                if a == b or a == c or b == c:
                                    break

                                # Deeper conditions
                                pr_a_given_bc = pr_total / (len(b_c) / 6)
                                pr_b_given_ac = pr_total / (len(a_c) / 6)
                                pr_c_given_ab = pr_total / (len(a_b) / 6)
                                if pr_a_given_bc == pr_a:
                                    break
                                if pr_b_given_ac == pr_b:
                                    break
                                if pr_c_given_ab == pr_c:
                                    break

                                if a == {2, 4, 6} or b == {2, 4, 6} or c == {2, 4, 6}:
                                    # Get evens case only!
                                    print(a, b, c)
                                    sys.exit(1)


if __name__ == '__main__':
    gen()

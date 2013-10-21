#!/usr/bin/python
# -*- coding: utf-8 -*-

from sys import argv

d3 = open(argv[1]).read()

illegal = {
           'γ': 'gamma',
           'δ': 'delta',
           'Δ': 'Delta',
           'ε': 'epsilon',
           'λ': 'lambda',
           'π': 'pi',
           'ρ': 'rho',
           'τ': 'tau',
           'φ': 'phi',
           }

for c in illegal.keys():
    d3 = d3.replace(c, illegal[c])

open(argv[1], 'w').write(d3)

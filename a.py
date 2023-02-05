#!D:\Python3.7.9\python.exe
import os
import sys

path = os.path.dirname(__file__)
if path == '':
    path = sys.path[0]
arr = os.walk(path + "\waves").__next__()[2]
string = '['
length = len(arr)
for i in range(length):
    string += '{\"title\":\"'
    string += arr[i][:-4]
    string += '\"}'
    if i != length - 1:
        string += ','
string += ']'
file = open(path + "/index.json", 'w')
file.write(string)
file.close()
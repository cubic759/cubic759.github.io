#!D:\Python3.7.9\python.exe
import os
import sys


def compare(s1: str, s2: str):
    if s1.find('w') != -1 and s2.find('w') != -1:
        a1 = s1.split('w')[1]
        a2 = s2.split('w')[1]
        if int(a1) > int(a2):
            return 1
        else:
            return 0
    else:
        a1 = s1.split('w')[0].split('-')
        a2 = s2.split('w')[0].split('-')
        for i in range(3):
            if int(a1[i]) > int(a2[i]):
                return 1
            elif int(a1[i]) < int(a2[i]):
                return 0


path = os.path.dirname(__file__)
if path == '':
    path = sys.path[0]
arr = os.walk(path + "\waves").__next__()[2]
string = '['
length = len(arr)
latest = '0-0-0'
latestIndex = -1
for i in range(length):
    arr[i] = arr[i][:-4]
for i in range(length):
    latest = '0-0-0'
    for j in range(i, length, 1):
        if compare(arr[j], latest) == 1:
            latest = arr[j]
            latestIndex = j
    temp = arr[i]
    arr[i] = arr[latestIndex]
    arr[latestIndex] = temp
for i in range(length):
    string += '{\"title\":\"'
    string += arr[i]
    string += '\"}'
    if i != length - 1:
        string += ','
string += ']'
file = open(path + "/index.json", 'w')
file.write(string)
file.close()
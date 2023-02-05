#!D:\Python3.7.9\python.exe
import os

path = os.path.dirname(__file__)
print(path)
arr = os.walk("waves").__next__()[2]
string = '['
length = len(arr)
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
input()
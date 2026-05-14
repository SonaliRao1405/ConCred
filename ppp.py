status=[]
def Push_element(list1):
 for i in list1:
  if i% 7==0:
   status.append(i)
 print(status)
list1=eval(input('enter the integer list:'))
Push_element(list1)

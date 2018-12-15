#!/usr/bin/env python
# coding: utf-8

# In[8]:


import numpy as np
import cv2
import os
car_cascade = cv2.CascadeClassifier('./cars.xml')
# eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')
img = cv2.imread('./highway.png')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)



# In[ ]:





# In[ ]:





# In[ ]:





# In[9]:


cap = cv2.VideoCapture("./south.mp4")
while True:
    ret, img = cap.read()
    if (type(img) == type(None)):
        break
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    cars = car_cascade.detectMultiScale(gray, 1.1, 1)

    for (x,y,w,h) in cars:
        cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)      
    
    cv2.imshow('video', img)
    
    if cv2.waitKey(33) == 27:
        break

cv2.destroyAllWindows()


# In[4]:


#https://www.youtube.com/watch?v=NpWe0Y0NUTI
cap = cv2.VideoCapture("./video3.avi")
while True:
    ret, img = cap.read()
    if (type(img) == type(None)):
        break
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    cars = car_cascade.detectMultiScale(gray, 1.1, 1)
    
    for (x,y,w,h) in cars:
        cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
    
    cv2.imshow('video', img)
    
    if cv2.waitKey(33) == 27:
        break

cv2.destroyAllWindows()


# In[12]:


cap = cv2.VideoCapture("./video5.avi")
count = 0
while True:
    ret, img = cap.read()
    if (type(img) == type(None)):
        break
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    cars = car_cascade.detectMultiScale(gray, 1.1, 1)
    
    for (x,y,w,h) in cars:
        crop_img = img[y:y+h, x:x+w]
        cv2.imshow('video', crop_img)
        cv2.imwrite( "./images/car" + str(count) + ".bmp", crop_img);
        count += 1
        #cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
        
    #cv2.imshow('video', img)
    
    if cv2.waitKey(33) == 27:
        break

cv2.destroyAllWindows()


# In[7]:


cap = cv2.VideoCapture("./video5.m4v")
count = 0
while True:
    ret, img = cap.read()
    if (type(img) == type(None)):
        break
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    cars = car_cascade.detectMultiScale(gray, 1.1, 1)
    
    for (x,y,w,h) in cars:
        crop_img = img[y:y+h, x:x+w]
        cv2.imshow('video', crop_img)
        cv2.imwrite( "./images/car" + str(count) + ".bmp", crop_img);
        count += 1
        #cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
        
        #os.system("python runningSeparate.py ./images/car" + str(count) + ".bmp")
    #cv2.imshow('video', img)
    
    if cv2.waitKey(33) == 27:
        break

cv2.destroyAllWindows()


# In[9]:


import numpy as np
import cv2
import pyscreenshot as ig
import time

last_time = time.time()
while(True):
    screen = ig.grab(bbox=(0,0,475,1054))
    
    img = np.array(screen)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    cars = car_cascade.detectMultiScale(gray, 1.1, 1)

    for (x,y,w,h) in cars:
        cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)      
    
    cv2.imshow('video', img)
    
    
    if cv2.waitKey(25) & 0xFF == ord('q'):
        cv2.destroyAllWindows()
        break


# In[ ]:





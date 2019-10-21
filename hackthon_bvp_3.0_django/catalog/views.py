from django.urls import path
from . import views

from django.http import HttpResponse
from django.http import JsonResponse

import numpy as np

import google.cloud
from firebase_admin import firestore


def helloWorld(request):
    return JsonResponse({'status':"hello World"})

def index(request, user_id):
    store = firestore.client()
    # Get an HttpRequest - the request parameter
    # perform operations using information from the request.
    # Return HttpResponse
    # try:
    #     docs = doc_ref.get()
    #     # my_dict = { el.id: el.to_dict() for el in doc }
    #     # for doc in docs:
    #     #     print(u'Doc Data:{}'.format(doc.to_dict()))
    # except google.cloud.exceptions.NotFound:
    #     print(u'Missing data')
    # return JsonResponse({'foo':'bar'})




#from surprise import KNNWithMeans

#sim_options = {
 #   "name": "cosine",
  #  "user_based": False,
#}
#algo = KNNWithMeans(sim_options=sim_options)

    doc_ref = store.collection(u''+user_id).document(u'tags')
    doc = doc_ref.get()
    user = doc.to_dict().get("Tag")
    # my_dict = { el.id: el.to_dict() for el in doc }

    bangalore={}
    
    # dic["history"]=["abc","xyz"]
    # dic["wildlife"]=["nagarhole national park","Bandipur tiger reserve","eraviculam national park"]
    bangalore["places"]=["bandipur tiger reserve","nagarhole national park","eraviculam national park","Ramanagara Trekking Camp","Antara Gange Night Trek","Bheemeshwari","Visvesvaraya Industrial and Technological Museum","HAL Aerospace Museum","Tipu Sultan’s Summer Palace","ISKCON Temple"]
    bangalore["bandipur tiger reserve"]=["x","y","wildlife","sports",0]
    bangalore["nagarhole national park"]=["x","y","wildlife","adventure",0]
    bangalore["eraviculam national park"]=["x","y","wildlife","history",0]
    bangalore["Ramanagara Trekking Camp"]=["x","y","sports","adventure",0]
    bangalore["Antara Gange Night Trek"]=["x","y","sports","adventure",0]
    bangalore["Bheemeshwari"]=["x","y","wildlife","adventure",0]
    bangalore["Visvesvaraya Industrial and Technological Museum"]=["x","y","science","history",0]
    bangalore["HAL Aerospace Museum"]=["x","y","science","adventure",0]
    bangalore["Tipu Sultan’s Summer Palace"]=["x","y","history","adventure",0]
    bangalore["ISKCON Temple"]=["x","y","history","science",0]
    
    for i in bangalore["places"]:
        for j in range(2,4):
            print(bangalore[i][j])
    
    
    for i in bangalore["places"]:
        if user[0]==bangalore[i][2] or user[0]==bangalore[i][3]:
            bangalore[i][4]+=1
        if user[1]==bangalore[i][2] or user[1]==bangalore[i][3]:
            bangalore[i][4]+=1
        if user[2]==bangalore[i][2] or user[2]==bangalore[i][3]:
            bangalore[i][4]+=1
    
    #for i in bangalore["places"]:
     #   print(bangalore[i][4])
    
    ans=[]
    
    k=0
    for i in bangalore["places"]:
        if k<5:
            if bangalore[i][4]==2:
                ans.append(i)
                k+=1
    
    if k<5:
        for i in bangalore["places"]:
            if k<5:
                if bangalore[i][4]==1:
                    ans.append(i)
                    k+=1
    
    print(ans)
    
    def distance(x1, x2):
        return np.sqrt(((x1-x2)**2).sum())
    
    def ml(x, train, targets, k=7):
        m = train.shape[0]
        dist = []
        labels=[]
        for ix in range(m):
            dist.append(distance(x, train[ix]))
        dist = np.asarray(dist)
        indx = np.argsort(dist)
        sorted_labels = labels[indx][:k]
        counts = np.unique(sorted_labels, return_counts=True)
        return counts[0][np.argmax(counts[1])]
    
    #######   default    ##############
    
    for i in bangalore["places"]:
        bangalore[i][4]=0
        #print(bangalore[i][4])
    
    #print(dic)
    #bangalore["Bheemeshwari"][4]+=1
    #print(bangalore["Bheemeshwari"][4])


    # result = map(lambda x: x + x, ans) 
    # print(list(result)) 

    store.collection(u''+user_id).document(u'Tour').set({
        "places":ans
    })

    return JsonResponse({'status':1})
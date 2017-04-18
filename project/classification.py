import numpy as np
from sklearn.cross_validation import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score



class Classification(object):

    def avgTempClassificationOnCoordinates(self, pAvgTemp, pCoordinate):     
           
        AT = []
        for n in pAvgTemp:
            if n > 30:
                AT.append('High_Temperature')
            elif n <= 30 and n > 10:
                AT.append('Medium_Temperature')
            else:
                AT.append('Cold_Temperature')


        return (pCoordinate, AT)

    def avgTempPredectionBasedOnCoordinates(self, pAvgTemp, pCoordinate, Latitude, Longitude):      
        print "aaaaa"  
        AT = []
        for n in pAvgTemp:
            if n > 30:
                AT.append('High_Temperature')
            elif n <= 30 and n > 10:
                AT.append('Medium_Temperature')
            else:
                AT.append('Cold_Temperature')


        feature_train, feature_test, target_train, target_test = train_test_split(pCoordinate, AT, test_size=0.2, random_state=42)
        clf = GaussianNB()
        clf.fit(feature_train, target_train)
        pre = clf.predict(feature_test)
        pred = clf.predict([100,100])
        print pred
        score = accuracy_score(target_test, pre)
        print score
        return (pred,score)

    
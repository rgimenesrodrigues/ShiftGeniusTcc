/**
 * @description       : 
 * @author            : Amit Singh
 * @group             : 
 * @last modified on  : 07-11-2020
 * @last modified by  : Amit Singh
 * Modifications Log 
 * Ver   Date         Author       Modification
 * 1.0   07-11-2020   Amit Singh   Initial Version
**/
public without sharing class FullCalendarService {

    @AuraEnabled
    public static List<Event> fetchAllEvents(){
        List<Event> eventList = new List<Event>();
        eventList = [Select Id, Subject, WhatId, WhoId, 
                    Description, EndDate, EndDateTime, OwnerId,PlantaoLivre__c,Hospital__c,	Valor_a_Receber__c,
                    ActivityDate, ActivityDateTime From Event];
        return eventList;
    }
    @AuraEnabled
    public static boolean  updateItemStatus(String itemId){
        boolean returnValue = true;
        event evento = new event();
        try{
            evento.id = itemId;
            evento.PlantaoLivre__c =  false;
        
        update evento;

        }
        catch(exception ex){
            system.debug(ex.getMessage());
            returnValue = false;
        }
        return returnValue;
    }
    
}
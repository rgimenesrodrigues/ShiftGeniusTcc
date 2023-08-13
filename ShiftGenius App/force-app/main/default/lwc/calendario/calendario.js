import { LightningElement, track,wire,api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import IMAGES from '@salesforce/resourceUrl/static_images';
import { NavigationMixin,CurrentPageReference  } from 'lightning/navigation';
import fetchAllEvents from '@salesforce/apex/GerenciarPlantoesService.fetchAllEvents';
import updateItemStatus from '@salesforce/apex/GerenciarPlantoesService.updateItemStatus';
import pegaInformacoesUsuario from '@salesforce/apex/GerenciarPlantoesService.pegaInformacoesUsuario';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Contact.Name', 'Contact.Especialidade__c'];



/**
 * FullCalendarJs
 * @description Full Calendar JS - Lightning Web Components
 */
export default class FullCalendarJs extends NavigationMixin(LightningElement) {

  fullCalendarJsInitialised = false;
  @track allEvents = [];
  @track selectedEvent = undefined;
  @track ehMedico = false;
  @track ehShiftmed = false;
  @track ehCoordenador = false; 
  @track nomeUsuario = '';
  @track cidadeUsuario = '';
  @track especialidades = '';
  @track coordenador = '';
  
  userInfoMap;

    
  
  createRecord = false;
  logoImage = IMAGES + '/static_images/images/logo.jpg';

  /**
   * @description Standard lifecyle method 'renderedCallback'
   *              Ensures that the page loads and renders the 
   *              container before doing anything else
   */
  renderedCallback() {

    // Performs this operation only on first render
    if (this.fullCalendarJsInitialised) {
      return;
    }
    this.fullCalendarJsInitialised = true;

    // Executes all loadScript and loadStyle promises
    // and only resolves them once all promises are done
    Promise.all([
      loadScript(this, FullCalendarJS + '/jquery.min.js'),
      loadScript(this, FullCalendarJS + '/moment.min.js'),
      loadScript(this, FullCalendarJS + '/theme.js'),
      loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
      loadStyle(this, FullCalendarJS + '/fullcalendar.min.css'),
      //loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
    ])
    .then(() => {
      // Initialise the calendar configuration
      this.populaInformacoesUsuario();
      this.getAllEvents();
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({
        message: 'Error occured on FullCalendarJS',
        error
      });
    })
  }

  /**
   * @description Initialise the calendar configuration
   *              This is where we configure the available options for the calendar.
   *              This is also where we load the Events data.
   */
  initialiseFullCalendarJs() {

    
    //this.populavariaveis();
    const ele = this.template.querySelector('div.fullcalendarjs');
    
    // eslint-disable-next-line no-undef
    $(ele).fullCalendar({
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay,listWeek'
      },
      themeSystem : 'standard',
      defaultDate: new Date(), 
      locale: 'pt-br',
      timeFormat: 'HH:mm',
      navLinks: true,
      editable: true,
      eventLimit: false,
      displayEventTime: this.displayEventTime,
      slotLabelFormat: 'HH:mm',
      allDayText: '24 horas',
      columnFormat: 'dddd',
      events: this.allEvents,
      dragScroll : true,
      droppable: true,
      weekNumbers : false,
      eventDrop: this.eventDropHandler.bind(this),
      eventClick: this.eventClickHandler.bind(this),
      dayClick : this.dayClickHandler.bind(this),
      eventMouseover : this.eventMouseoverHandler.bind(this),
      buttonText: {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Hoje',
        list: 'Lista'
      },
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    });
  }

  eventMouseoverHandler = (event, jsEvent, view)=>{

  }

  popularvariaveis = ()=>{
    this.ehMedico = this.userInfoMap['papel'] == 'médico';
    this.ehCoordenador = this.userInfoMap['papel'] == 'coordenador';
    this.ehShiftmed = this.userInfoMap['papel'] == 'shiftMed';
    this.nomeUsuario = this.userInfoMap['Nome'];
    this.cidadeUsuario = this.userInfoMap['Cidade'];
    this.especialidades = this.userInfoMap['Especialidades'];
    this.coordenador = this.userInfoMap['Coordenador'];

  }
  eventDropHandler = (event, delta, revertFunc)=>{
    alert(event.title + " was dropped on " + event.start.format());
    if (!confirm("Are you sure about this change? ")) {
      revertFunc();
    }
  }

  eventClickHandler = (event, jsEvent, view) => {
      this.selectedEvent =  event;
  }

  dayClickHandler = (date, jsEvent, view)=>{
    jsEvent.preventDefault();
    this.createRecord = true;
  }

  createCancel() {
    this.createRecord = false;
  }

  populaInformacoesUsuario() {
    pegaInformacoesUsuario()
      .then(result => {
        // Process the result and set it to a property
        this.userInfoMap = result;
        this.popularvariaveis();
      })
      .catch(error => {
        console.error('Error fetching user information', error);
      });
  }



  getAllEvents(){
      fetchAllEvents()
      .then(result => {
        this.allEvents = result.map(item => {
          
          //let color = 'rgb(256,256,256)';
          //if(item.plantaoLivre__c){
          //  color = 'rgb(255,248,30)';
          //}
          return {
            id : item.Id,
            editable : true,
            title : item.Subject,
            start : item.ActivityDateTime,
            end : item.EndDateTime,
            horaInicio : item.horaInicio__c,
            horaFim : item.EndDateTime,
            description : item.Description,
            allDay : false,
            plantaoLivre : item.PlantaoLivre__c,
            valorPlantao : item.ValorMedico__c,
            valorShiftMed : item.ValorShiftMed__c,
            nomeMedico : item.NomeMedico__c,
            hospital : item.Hospital3__c,
            extendedProps : {
              whoId : item.WhoId,
              whatId : item.WhatId
              
            },
            backgroundColor: (item.PlantaoLivre__c?'rgb(0,153,0)':'rgb(0,102,204)') 
            
            
            
            
            //borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
          };
        });
        // Initialise the calendar configuration
        this.initialiseFullCalendarJs();
      })
      .catch(error => {
        window.console.log(' Error Occured ', error)
      })
      
  }



  closeModal(){
    this.selectedEvent = undefined;
  }
  
  updateItemStatus() {
    updateItemStatus({ itemId: this.selectedEvent.id })
        .then(result => {
            if (result) {
                this.showToast('Assumir plantão', 'Você assumiu o plantão', 'success');
                this.selectedEvent = undefined;
                this.fetchAndReloadEvents(); // Call the function to re-fetch and re-initialize events
            } else {
              this.showToast('Erro','Erro ao assumir plantão','error');
            }
        })
        .catch(error => {
            alert(error);
            console.log('error: ', error);
            this.selectedEvent = undefined;
        });
}

  showToast(_title,_message,_variant) {
    const event = new ShowToastEvent({
        title: _title,
        message: _message,
        variant: _variant,
    });
    this.dispatchEvent(event);
}


  fetchAndReloadEvents() {
    fetchAllEvents()
        .then(result => {
          this.allEvents = result.map(item => {
          
            //let color = 'rgb(256,256,256)';
            //if(item.plantaoLivre__c){
            //  color = 'rgb(255,248,30)';
            //}
            return {
              id : item.Id,
              editable : true,
              title : item.Subject,
              start : item.ActivityDateTime,
              end : item.EndDateTime,
              horaInicio : item.horaInicio__c,
              horaFim : item.EndDateTime,
              description : item.Description,
              allDay : false,
              plantaoLivre : item.PlantaoLivre__c,
              valorPlantao : item.ValorMedico__c,
              valorShiftMed : item.ValorShiftMed__c,
              nomeMedicoPlantao : item.nomeMedico__c,
              hospital : item.Hospital3__c,
              extendedProps : {
                whoId : item.WhoId,
                whatId : item.WhatId
                
              },
              backgroundColor: (item.PlantaoLivre__c?'rgb(0,153,0)':'rgb(0,102,204)') 
              
              
              
              
              //borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
            };
            });
            // Re-initialize the calendar configuration
            this.initialiseFullCalendarJs();
        })
        .catch(error => {
            window.console.log('Error Occurred', error);
        });
}


  

  
}
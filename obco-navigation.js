"use strict";

angular.module('obcoNavigation',[]).factory('navigationService', ['$injector', '$q', 'config', function($injector, $q, config) {

  var can_go_next = false;
  var can_go_back = false;
  var step_objective = '';
  var currentStep = null;
  var previousStep = null;
  var nextStep = null;
  var rule;

  return {
       getCurrentStep: function() {
            return currentStep;
       },

       setCurrentStep: function(step) {
            currentStep = step;
            this.init();
       },

       setPreviousStep: function(step) {
            previousStep = step;
            this.init();
       },
       setNextStep: function(step) {
            nextStep = step;
            this.init();
       },
       hasNextStep: function() {
        return !_.isEmpty(nextStep);
       },
       hasPreviousStep: function() {
        return !_.isEmpty(previousStep);
       },
       getNextStepName: function() {
           return nextStep.name;
       },
       getPreviousStepName: function() {
            return previousStep.name;
       },
       testTransitions: function() {
            this.canGoBackward();
            this.canGoForward();
       },
       init:function() {
            this.testTransitions();
       },
       canGoBackward: function() { 
           if(previousStep && previousStep.data && previousStep.data.prerequisite) {
               if(!!config.debug_navigation) console.info('asking if it’s ok going backward to', previousStep.name );
               var prom =  $injector.invoke(previousStep.data.prerequisite)
               prom.then(function(data) {
                 can_go_back = true;
               }, function(err) {
                 can_go_back = false;
               }); 
               return prom;
           } else {
                can_go_back = true;
                return $q(function(resolve) { resolve('by default') });
           }
       },
       canGoForward: function() { 
           if(nextStep && nextStep.data && nextStep.data.prerequisite) {
               if(!!config.debug_navigation) console.info('asking if it’s ok going forward to', nextStep.name);
               var prom =  $injector.invoke(nextStep.data.prerequisite)
               prom.then(function(data) {
                 can_go_next = true;
               }, function(err) {
                 can_go_next = false;
               }); 
               return prom;
           } else {
               if(!!config.debug_navigation) console.info('resolve can go forward by default');
               can_go_next = true;
               return $q(function(resolve) { resolve('by default') });
           }
       },
       canGoForwardFlag: function() { return can_go_next; },
       canGoBackwardFlag: function() { return can_go_back; },

       setStepObjective : function(objective) {
           step_objective = objective;
       },

       stepObjective: function() {
            return step_objective;
       }
  };
}]);

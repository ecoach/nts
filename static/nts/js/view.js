
// VIEWS (USER INTERFACE MANAGEMENT)

var ViewQuestion = Class.create();
ViewQuestion.prototype={

    initialize: function(nts_model) // pass in nts model
    {
        this.container = jQuery('#question-container');
        this.left = jQuery('#ans-container-left');
        this.right = jQuery('#ans-container-right');
        this.feedback = jQuery('#feedback-container');

        this.model = nts_model;
	},

    present_question: function()
    {
        // cleanup 
        this.feedback.hide();
        // get models
        var question = this.model.get_question();
        var choices = question.choices;
        // buttons
        jQuery('#submit-ans-btn').show();
        jQuery('#continue-btn').hide();
        this.disable_submit();
        // scoring
        this.present_qnumber();
        // question text
        jQuery('#question-text-container').html(question.question);
        // dynamically create answer choice buttons
        this.left.empty();
        this.right.empty();
        sides = Array(this.left, this.right);
        for (var ii = 0; ii < choices.length; ii++)        
        {   
            var button = jQuery("<button type='button' id='ans_" + choices[ii] + "' class='btn choice-btn'></button></br>");
            button.html(choices[ii]);
            sides[ii % 2].append(button);
        }
        // assign the click methods 
        jQuery(".choice-btn").click(function()                                 
        { 
            select_answer(this.id);
        });
	},

    present_qnumber:function()
    {
        var str = "Question " + nts_model.asked + " / " + nts_model.total;
        jQuery('#right-score-value').empty();
        jQuery('#right-score-value').append(str);
    },

    select_answer : function(btn_id)
    { 
        this.clear_selection();
        btn = jQuery('#'+btn_id);
        if (btn.hasClass('btn-inverse'))
        {
            btn.removeClass('btn-inverse');    
            jQuery('#'+btn_id+' > i').remove();
        }
        else
        {
            btn.addClass('btn-inverse');    
            btn.append("<i class='icon-ok icon-white pull-right'>")
        }
        this.enable_submit();
    },

    clear_selection:function()
    {   
        jQuery('.choice-btn').removeClass('btn-inverse');    
        jQuery('.choice-btn > i').remove();
        this.disable_submit();
    }, 
 
    get_selected:function()
    {
        selected = jQuery('.choice-btn.btn-inverse');
        ids=Array();
        for(var ii=0; ii<selected.length; ii++)
            ids.push(selected[ii].id);
        return ids;
    },

    enable_submit : function()
    {
        jQuery('#submit-ans-btn').removeClass('disabled'); 
        jQuery('#submit-ans-btn').attr("disabled", false);
    },

    disable_submit : function()
    {
        jQuery('#submit-ans-btn').addClass('disabled'); 
        jQuery('#submit-ans-btn').attr("disabled", true);
    },

    present_scored: function()
    {
        // disable submit
        jQuery('.choice-btn').addClass('disabled');
        jQuery('.choice-btn').attr("disabled", true);
        jQuery('#submit-ans-btn').hide();
        jQuery('#continue-btn').show();
        // get the question
        var question = this.model.get_question()
        var msg;
        
        // respond to correctness
        if(question.resp_correct())
        {   
            this.feedback.addClass('alert-success');
            this.feedback.removeClass('alert-error');
            msg = "Correct! Good job :) ";
        }
        else
        {
            this.feedback.addClass('alert-error');
            this.feedback.removeClass('alert-success');
            msg = "Whoops! The answer is '" + question.scenario + "'. ";
            
        }
        this.feedback.html(msg + question.feedback);
        this.feedback.fadeIn();

        // update score
        var str = "Correct : " + nts_model.score
        jQuery('#left-score').empty();
        jQuery('#left-score').append(str);
	},

    show:function()
    {
        this.container.fadeIn();
    },

    hide:function()                         
    {   //to hide questions initially
        this.container.hide();
    }

}

var ViewSetup=Class.create();
ViewSetup.prototype={

    initialize: function(nts_model) // pass in nts model
    {
        this.container = jQuery('#setup-container');
        this.left = jQuery('#options-container-left');
        this.right = jQuery('#options-container-right');

        this.model = nts_model;
        this.populate();
    },

    populate:function()
    {
        this.left.empty();
        this.right.empty();
        sides = Array(this.left, this.right);
        // dynamically create scenario buttons
        for (var i = 0; i <= this.model.scenarios.length-1; i++)        
        {   
            var name = this.model.scenarios[i].name;
            var button = jQuery("<button type='button' id='" + name + "' class='btn scenario-btn'></button></br>");
            button.html(name);
            sides[i % 2].append(button);
        }
        // assign the click methods 
        jQuery(".scenario-btn").click(function()                                 
        {   

            setup_view.toggle_selection(this.id);
            
        });
        this.begin_game();
    },

    toggle_selection : function(btn_id)
    {  
        //alert(btn_id);
        btn = jQuery('#'+btn_id);
        if (btn.hasClass('btn-inverse'))
        {
            btn.removeClass('btn-inverse');    
            jQuery('#'+btn_id+' > i').remove();
        }
        else
        {
            btn.addClass('btn-inverse');    
            btn.append("<i class='icon-ok icon-white pull-right'>")
        }
        this.begin_game();
    },
    
    begin_game : function()
    {
        if (this.get_selected().length > 1)
            jQuery('#begin-btn').attr("disabled", false).removeClass("ui-state-disabled");
        else
            jQuery('#begin-btn').attr("disabled", true);
    },

    clear_selection:function()
    {   
        jQuery('.scenario-btn').removeClass('btn-inverse');    
        jQuery('.scenario-btn > i').remove();
        this.begin_game();
    }, 

    get_selected:function()
    {
        selected = jQuery('.scenario-btn.btn-inverse');
        ids=Array();
        for(var ii=0; ii<selected.length; ii++)
            ids.push(selected[ii].id);
        return ids;
    },

    show:function()             
    {   //to show first page
        this.container.fadeIn();
    },

    hide:function()
    {
        this.container.hide();
    }
}


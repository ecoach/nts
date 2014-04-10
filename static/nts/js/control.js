// CONTROL (EVENT PROCESSING)

var nts_model;
var setup_view;
var question_view;

function event_log(elog, json)
{
    logger.logEvent(false, elog, json); // pageview is always false
}

function init_nts(concepts)
{
    cc = Array();
    for(var ii=0; ii<concepts.length; ii++)
    {
        // inside scenarioX.js expect to find scenario object scenarioX
        // list of concept file names passed in, remove *.js extensions to get object names
        var str = concepts[ii].substring(0,concepts[ii].length - 3)
        cc.push(eval(str));
    }

    nts_model = new ModelNts(cc);

    // initialize views
    setup_view = new ViewSetup(nts_model);
    question_view = new ViewQuestion(nts_model);
    question_view.hide();

    // log entry (time)
    var elog = {
        'eventCategory': 'nts',
        'eventAction': 'initialize'
    };
    event_log(elog);
}

function select_scenario(scenario_id)      
{
    // updates views
    setup_view.toggle_selection(scenario_id)
}

function clear_selection()     
{  
    // updates views
    setup_view.clear_selection();
}

function begin()                
{   
    // read the view
    selections = setup_view.get_selected();  

    // update models 
    nts_model.create_quiz(selections);
    
    // update views
    setup_view.hide();
    question_view.show();
    question_view.present_question();

    // log entry (choices)
    json = {};
    json.selections = selections
    var elog = {
        'eventCategory': 'nts',
        'eventAction': 'load',
        'eventLabel': 'number_of_scenarios',
        'eventValue': selections.length
    };
    event_log(elog, json);
}

function select_answer(scenario_id)         
{
    // updates views
    question_view.select_answer(scenario_id);
}

function submit_answer()
{  
    // read the view
    var ans_id = question_view.get_selected()[0];
    var resp = ans_id.substring(4,ans_id.length);

    // update model
    nts_model.set_response(resp);
    // log entry for answer
    question = nts_model.get_question();
    correct = question.resp_correct();
    json = {};
    json.correct = correct;
    json.answer = question.scenario;
    json.choice = resp;
    json.question = nts_model.current_question.question;
    var elog = {
        'eventCategory': 'nts',
        'eventAction': 'answer',
        'eventLabel': 'correct',
        'eventValue': correct
    };
    event_log(elog, json);

    // update views
    question_view.present_scored();

}

function continue_next_question()                       
{   
    if(nts_model.game_finished())
        game_finish();
    else
    {
        // update models 
        nts_model.pop_question();
        
        // update views
        jQuery('#question-number').empty();
        question_view.present_question();
    }

    // log entry (time reading feedback)
    var elog = {
        'eventCategory': 'nts',
        'eventAction': 'continue-next-question'
    };
    event_log(elog);
}

function game_finish()                                      
{   
    var elog = {
        'eventCategory': 'nts',
        'eventAction': 'game-finished'
    };
    event_log(elog);
    alert("That's it! Refresh the page and start over when you're ready for another NTS quiz.");    
}


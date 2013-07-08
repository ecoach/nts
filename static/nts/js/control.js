// CONTROL (EVENT PROCESSING)

var nts_model;
var setup_view;
var question_view;

function event_log(what)
{
    ecoach.util.logEvent(what);
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
    event_log("{'nts': {'action':'load'}}");
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
    event_log("{'nts': {'action':'begin'}, {'data': {'selections':['"+selections.join("','")+"']}}}");
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
    // log entry (question, choices, selected, correct)
    question = nts_model.get_question();
    event_log("{'nts': {'action':'answer'}, {'data': {'correct': '"+question.resp_correct()+"', 'answer':'"+question.scenario+"', 'choice':'"+resp+"', 'question': '"+nts_model.current_question.question+"'}}}");
    

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
    event_log("{'nts': {'action':'continue-next-question'}}");
}

function game_finish()                                      
{   
    alert("That's it!");    
    event_log("{'nts': {'action':'game-finished'}}");
}


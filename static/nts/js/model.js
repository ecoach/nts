// MODELS
var ModelNts = Class.create();
ModelNts.prototype={

	scenarios : Array(),
    remaining: Array(),
    current_question:"",
    asked:1,
    total:0,
    score:0,

    initialize: function(scenarios)
    {
		len=scenarios.length;
		for(var i=0;i<len;i++)
		{
			this.scenarios.push(scenarios[i]);
		}
	},

    create_quiz: function(selected)
    {
        // this works
        answer_choices = selected;
        // keep only selected scenarios
        keeps=Array();
        for(var ss=0; ss<this.scenarios.length; ss++)
        {
            for(var kk=0; kk<selected.length; kk++)
            {
                if(selected[kk] == this.scenarios[ss].name)
                    keeps.push(this.scenarios[ss]);
            }
        }
        // create question list
        this.remaining = Array();
		for(var kk=0; kk<keeps.length; kk++)
      	{
            questions = keeps[kk].questions
      		for(var qq=0; qq<questions.length; qq++)
      		{
      			qN = new ModelQuestion(keeps[kk].name, questions[qq][0], questions[qq][1], answer_choices)
      			this.remaining.push(qN);
      		}
    	}
    	this.total=this.remaining.length;

    	// shuffle
        this.shuffle_quiz();
        this.pop_question();
    },

    shuffle_quiz:function()
    {
        // scrambles array elements
        this.remaining.sort(function() {return 0.5 - Math.random()}) 
	},

    get_question: function()
    {
        return this.current_question;
    },

    pop_question: function()
    {
        this.current_question=this.remaining.pop();
    },

    set_response: function(resp)
    {
        this.current_question.set_response(resp);
        this.score_keep();
    },

    score_keep:function()
	{
		var question=nts_model.get_question();
		if (question.resp_correct()==true)
			this.score += 1;
        this.asked += 1;
	},

    game_finished: function()
    {
        if (this.remaining.length == 0) 
            return true;
        else
            return false;
    }

};

var ModelQuestion = Class.create();
ModelQuestion.prototype = {

	scenario:"",
	question:"",
	response:"",
	feedback:"",
    choices: Array(),
   
	initialize: function(scenario, question, feedback, choices)
	{
		this.scenario = scenario;
		this.question = question;
		this.feedback = feedback;
        this.choices = choices;
	},

	set_response:function(resp)
	{
		this.response=resp;
	},

	resp_correct: function()
	{
		if(this.response==this.scenario)
            return true;
		else
            return false;
	},

	
};



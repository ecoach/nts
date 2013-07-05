from django.core.urlresolvers import reverse
from django.views.generic import TemplateView
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.conf import settings
from mynav.nav import main_nav

# Create your views here.

def nts_view(request):

    # dig up the scenario files
    from os import listdir
    from os.path import isfile, join
    scenario_files = [ f for f in listdir(settings.DIR_NTS) if isfile(join(settings.DIR_NTS,f)) ]
    return render(request, 'nts/base_nts.html', {
        "main_nav": main_nav(request.user, 'student_linkback'),
        "nts_concepts": scenario_files,
    })



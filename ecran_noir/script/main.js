var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

$( document ).ready(function() {
	/*  Bug de Bootstrap 3.3.5
	*  https://github.com/twbs/bootstrap/issues/16732
	*  À l'utilisation du 'hide' sur un popover,
	*  il faut cliquer 2 fois sur le bouton de l'infobulle pour revoir l'infobulle
	*  Fix temporaire jusqu'à ce qu'une prochaine mise à jour vienne corriger la situation
	*/
	$('body').on('hidden.bs.popover', function (e) {
		$(e.target).data("bs.popover").inState.click = false;
	});

	$('[data-toggle="popover"]').on('click', function(e) {
		e.preventDefault(); return true;
	});

  $(".newsletter button").on('click', function(){
    $("#modaleInfolettre").show();
    $("body").append('<div class="modal-backdrop in"></div>');
  });

  $("#modaleInfolettre button").on('click', function(){
    //$("#modaleInfolettre").hide();
    //$(".modal-backdrop").remove();
		var nom = $("#nom");
		var prenom = $("#prenom");
		var date = $("#date");
		var courriel = $("#courriel");
		var errors = $("#errors");
		var dateregexp = /^([0-2][0-9]|(3)[0-1])(\-)(((0)[0-9])|((1)[0-2]))(\-)\d{4}$/;

		if(nom.val().length === 0 || prenom.val().length === 0 || courriel.val().length === 0 || !dateregexp.test(date.val())) {
			errors.text("Il y a des erreurs dans le formulaire.");
			errors.show();
		} else {
			window.location.href = "https://a11y-sandbox.ciao.ca/lecteurecran/succes.html";
		}
  });

	$('#popoverToggle').popover({
		html: true,
		template: "<div class='popover' role='tooltip'><div class='popover-content'></div><button type='button' class='close'><span class='sr-only'>Fermer</span></button><div class='arrow'></div></div>",
		content: function() {
			return $(this).prev('.popover-info-content').html();
		}
	}).on('inserted.bs.popover', function() {
		var popover =           $(this).siblings('.popover'),
		popoverContent =    popover.find('.popover-content');

		if(popoverContent.height() > popover.height()) {
			popover.addClass('large');
			if( popoverContent.get(0).scrollHeight > popoverContent.get(0).clientHeight ) {
				popoverContent.addClass('scrollbar');
			}
		};

		popover.find('button.close').click( function() {
			popover.popover('hide');
			$('[data-toggle="popover"]').focus();
		});

	});

	$('#popoverModal').popover();

	$('.modal').on('shown.bs.modal', function() {
		$(this).attr('aria-hidden', 'false');
		$('.page').attr('aria-hidden', 'true');

	});

/*
*  Modale - cacher
*  Révèle le contenu de la page
*/
$('.modal').on('hidden.bs.modal', function() {
	$(this).attr('aria-hidden', 'true');
	$('.page').attr('aria-hidden', 'false');
});

$('.modal').keydown(function(event) {
	attraperNavClavier($(this), event);
});


});

/*  Modale navigation au clavier
*  Emprisonne l'utilisateur à l'intérieur de la modale
*  Permet la navigation en boucle de haut en bas & de bas en haut
*/
function attraperNavClavier(obj, e) {
	if (e.which == 9) {

		//Lister tous les enfants de l'élément de la modale
		var o = obj.find('*');

		//Lister les éléments focussable
		var itemFocussable;
		itemFocussable = o.filter(focusableElementsString).filter(':visible');

		//Récupérer l'élément ayant le focus
		var itemFocus;
		itemFocus = $(':focus');

		//Récupérer le nombre d'éléments focussable
		var nbItemFocussable;
		nbItemFocussable = itemFocussable.length

		//Récupérer l'index de l'élément ayant le focus
		var itemFocusIndex;
		itemFocusIndex = itemFocussable.index(itemFocus)

		if(e.shiftKey) {
		    // Boucle inversé
		    if(itemFocusIndex == 0) {
		    	itemFocussable.get(nbItemFocussable -1).focus();
		    	e.preventDefault();
		    }
		} else {
		    // Boucle sens normal
		    if(itemFocusIndex == nbItemFocussable -1) {
		    	itemFocussable.get(0).focus();
		    	e.preventDefault();
		    }

		}
	}
}

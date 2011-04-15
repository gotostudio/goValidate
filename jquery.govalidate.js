/*
 * jQuery goValidate plugin
 * @name jquery.govalidate.js
 * @author Massimiliano Pesente, @ilpes - http://www.gotostudio.it/
 * @version 0.9 
 * @date April 15, 2011
*/

  	var re_free   		 	= /\S+/;
  	var re_num    		 	= /^[0-9]+/;
  	var re_data    		 	= /^[0-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9][0-9][0-9]/;
  	var re_email   		 	= /^\w[\w\-\.]*@\w[\w\-\.]*\.[a-z]{2,3}$/i;
 	var re_multipleemail   	= /^((\w[\w\-\.]*@\w[\w\-\.]*\.[a-z]{2,3})|(\s)+)+$/i;

  
  	function testField(field){
	
		var regexp = null;
		
		     if(field.hasClass('free'))   			regexp = re_free;
		else if(field.hasClass('num'))    			regexp = re_num;
		else if(field.hasClass('email'))  			regexp = re_email;
		else if(field.hasClass('data'))   			regexp = re_data;
		else if(field.hasClass('multipleemail'))   	regexp = re_multipleemail;
		
		var val				= field.val();								 	//field value
		
		var tit 	 		= field.attr('title');						 	//title value
		var fieldname 		= field.attr('name');						 	//field name
		var fieldlabel  	= $('label[for="'+fieldname+'"]'); 			 	//field label 
	
		var defaultvalue	= fieldlabel.html();                 		 	//default label value
		var errorindex  	= defaultvalue.indexOf('<em>('+tit+')</em>');	//error string index
				
		switch(field.attr('type')){
		
			//txt
			case 'text':
			case 'textarea':
			
			if(field.hasClass('validifempty') && val == '') return true;
			else{
				
				if(regexp.test(val)){
					
					removeErrorMessage(field, fieldlabel, errorindex);
					return true;
				
				} 
				else {
					
					addErrorMessage(field,  fieldlabel, defaultvalue, tit);
					return false;
				
				}
			
			}
			
			break;
			
						
			//radio
			case 'radio':
				
				var rg = $(':input:radio[name="'+fieldname+'"]');
				var atleastoneselected = false
				
				jQuery.each(rg, function(){
					if(this.checked) atleastoneselected = true;
				})
				
				if(atleastoneselected) return true
				else {
					
					field.focus();
					return false;
				
				}
			
			break;
			
			case 'select-one':
			
				if(field.attr('selectedIndex') > 0) return true;
				else {
					
					field.focus();
					return false;
				
				}
			
			break;
			
			//checkbox
			case 'checkbox':
			
			if(fieldname.lastIndexOf("[]") == -1){
				
				if(field.attr('checked') == true) {
				
					removeErrorMessage(field, fieldlabel, errorindex);
					return true;
				
				} 
				else {
					
					addErrorMessage(field,  fieldlabel, defaultvalue, tit);
					return false;
				
				}

			}else{
				
				//multiple checkbox
				var all_cb = $(':input:checkbox[name="'+fieldname+'"]');
				var atleastonecbselected = false;
				
				jQuery.each(all_cb, function(){
					if(this.checked) atleastonecbselected = true;
				});
				
				if(atleastonecbselected) return true;
				else {
					
					field.focus();
					return false;
				
				}
				
			}
			
			break;
			
			//default
			default:
			
			if(regexp.test(val)) return true;
				else {
					field.focus();
					return false;
				}
			
			break;
		
		}
	
	}
	
	function addErrorMessage(field, fieldlabel, defaultvalue, message){
	
		if(defaultvalue.indexOf(message) == -1) {
						
			fieldlabel.html(defaultvalue+' <em>('+message+')</em>');						  
			field.addClass('error');
		
		}
					
		field.focus();

	}
	
	function removeErrorMessage(field, fieldlabel, errorindex){
	
		field.removeClass('error');
					
		if(errorindex > -1) {
					
			var oldstr = fieldlabel.html().substring(0, errorindex - 1);
			fieldlabel.html(oldstr);
					
	     }

	}
	
	function checkForm(form, callback){
			
		var is_valid  = true;
		var all_input = $('.required', form);
			
		jQuery.each(all_input, function(){
		
			if(!testField($(this))) {
						
				is_valid &= false;
				return false;
								
			}
					
		})
			
		if(is_valid) {
			
				if(jQuery.isFunction(callback)) callback.call();
				else form.submit();
			
		}else return false;
			
	}
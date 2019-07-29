$.noConflict();
$(document).ready(function() {
    
    const   results = $('#results'),
            trigger = $('#search'),
            byCategory = $('#by_category'),
            categoryChoice = $('#category_choice');//,
            // defaultChoice = $('#default');
    
    byCategory.change(function() {
        if (byCategory.is(':checked')) {
            categoryChoice.prop('disabled', false);
        } else {
            // categoryChoice.find('option').attr('selected', false);
            // defaultChoice.attr('selected', true);
            categoryChoice.prop('disabled', true);
        }

    })
    trigger.on("click", function() {
        $('#no-price').remove();
        results.html('');
        const price = $('#price').val();
        console.log(price);
        if (!price) {
            $('#price-form').append('<small id="no-price" style="color:red;">Please insert an ammount.</small>')
        }
        else {
            let category, categoryId;
            if (byCategory.is(':checked')) {    
                category = $('#category_choice option:selected').text();
                categoryId = $('#category_choice option:selected').val();
            } else {
                category = categoryId = null;
            }
            let order = $('input[type="radio"]:checked').val();
            console.log("Max price: " + price + ". Order: " + order + ". Category: " + category + " (" + categoryId + ").");
                  
            $.ajax({
                url: 'results',
                type: 'GET',
                dataType: 'json',
                data: {
                    price: price,
                    order: order,
                    category_id: categoryId
                },
                beforeSend: function(){
                    results.append('<div id="spinner" class="text-center mt-5"><i id="spinning" class="fas fa-atom"></i></div>');
                },
                success: function(products) {
                    console.log(products.length);
                    console.log(products);
                    if (!products.length)
                    {
                        results.append('<p>We hane no products that cheap!</p>');
                    }
                    else
                    {
                        results.append('<ul class="list-group list-group-flush">');
                        for (let product of products){
                            results.append('<li class="list-group-item"><a href="' + product.id + '">'
                            + product.name + '</a>, ' + product.price + '€ (' + product.category.name + ')</li>');
                        }
                        results.append('</ul>');
                    }
                },
                error: function(err) {
                    console.log(err);
                },
                complete: function() {
                    console.log('finished');
                    $('#spinner').remove();
                }
            });
        }
    });
})
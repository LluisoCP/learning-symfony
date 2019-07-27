$.noConflict();
$(document).ready(function() {

    const results = $('#results');
    const trigger = $('#search');

    trigger.on("click", function() {
        $('#no-price').remove();
        results.html('');
        const price = $('#price').val();
        console.log(price);
        if (!price) {
            $('#price-form').append('<small id="no-price" style="color:red;">Please insert an ammount.</small>')
        }
        else {
            const order = $('input[type="radio"]:checked').val();
            console.log("Max price selected: " + price + ". Order: " + order);
            
            $.ajax({
                url: 'results',
                type: 'GET',
                dataType: 'json',
                data: {
                    price: price,
                    order: order
                },
                beforeSend: function(){
                    results.append('<div id="spinner" class="text-center mt-5"><i id="spinning" class="fas fa-atom"></i></div>');
                },
                success: function(products) {
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
                            + product.name + '</a>, ' + product.price + '€ </li>');
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
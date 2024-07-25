// script.js
document.getElementById('addProduct').addEventListener('click', function() {
    const newProductRow = `<div class="form-row mt-2">
                            <div class="col">
                                <label>PRODUCTO</label>
                                <select class="form-control form-control-producto" name="ProductoID[]" required onchange="updateProductDetails(this)">
                                    {{#each productos}}
                                        <option value="{{this.ProductoID}}" data-precio="{{this.Precio}}" data-stock="{{this.Stock}}">{{this.ProductoCompleto}}</option>
                                    {{/each}}
                                </select>
                            </div>
                            <div class="col">
                                <label>STOCK</label>
                                <input type="text" class="form-control form-control-stock" readonly>
                            </div>
                            <div class="col">
                                <label>CANTIDAD</label>
                                <input type="number" class="form-control form-control-cantidad" name="Cantidad[]" min="0" required>
                            </div>
                            <div class="col">
                                <label>PRECIO UNITARIO</label>
                                <input type="number" class="form-control" name="PrecioUnitario[]" required readonly>
                            </div>
                            <div class="col">
                                <label>TOTAL PRD</label>
                                <input type="number" class="form-control" name="Totalproducto[]" readonly>
                            </div>
                        </div>`;
    document.getElementById('productos').insertAdjacentHTML('beforeend', newProductRow);
});

function updateProductDetails(selectElement) {
    const precio = selectElement.options[selectElement.selectedIndex].getAttribute('data-precio');
    const stock = selectElement.options[selectElement.selectedIndex].getAttribute('data-stock');
    const parentRow = selectElement.closest('.form-row');
    const stockInput = parentRow.querySelector('input.form-control-stock');
    const cantidadInput = parentRow.querySelector('input[name="Cantidad[]"]');
    const precioUnitarioInput = parentRow.querySelector('input[name="PrecioUnitario[]"]');
    const totalProductoInput = parentRow.querySelector('input[name="Totalproducto[]"]');

    stockInput.value = stock;
    precioUnitarioInput.value = precio;

    cantidadInput.addEventListener('input', function() {
        const cantidad = this.value;
        if (cantidad < 0) {
            alert('Cantidad inválida. No se permiten valores negativos.');
            this.value = '';
            totalProductoInput.value = '';
        } else if (cantidad > stock) {
            alert(`Stock inválido. Stock disponible: ${stock}`);
            this.value = '';
            totalProductoInput.value = '';
        } else {
            totalProductoInput.value = (cantidad * precio).toFixed(2);
        }
        updateTotal();
    });

    function updateTotal() {
        let total = 0;
        document.querySelectorAll('input[name="Totalproducto[]"]').forEach(function(input) {
            total += parseFloat(input.value) || 0;
        });
        document.getElementById('Total').value = total.toFixed(2);
    }
}

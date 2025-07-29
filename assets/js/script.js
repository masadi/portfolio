function firstUppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
$('#orderModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var produk = button.data('produk')
    var modal = $(this)
    modal.find('.modal-title').text(`Order e-Presensi (Paket ${firstUppercase(produk)})`)
    $('#paket').val(produk)
})
$("#orderForm").validate({
    rules: {
        nama: {
            required: true
        },
        npsn: {
            required: true,
        },
        alamat: {
            required: true,
        },
        admin: {
            required: true,
        },
        phone: {
            required: true,
        }
    },
    messages: {
        nama: {
            required: 'Bidang ini tidak boleh kosong!'
        },
        npsn: {
            required: 'Bidang ini tidak boleh kosong!',
        },
        alamat: {
            required: 'Bidang ini tidak boleh kosong!',
        },
        admin: {
            required: 'Bidang ini tidak boleh kosong!',
        },
        phone: {
            required: 'Bidang ini tidak boleh kosong!',
        }
    },
    submitHandler: function (form) {
        var $button = $('#submitButton');
        var originalText = $button.html();
        $button.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + $button.data('loading-text'));
        $.post('https://presensi.mas-adi.net/api/checkout', $(form).serialize()).done(function (response) {
            const errors = [];
            console.log(response);
            $button.prop('disabled', false).html(originalText);
            if (response.success) {
                $('#nama').val('')
                $('#npsn').val('')
                $('#alamat').val('')
                $('#admin').val('')
                $('#phone').val('')
                Swal.fire({
                    title: "Pendaftaran Berhasil!",
                    text: "Permintaan Anda sedang diproses. Tim admin kami akan menghubungi Anda secepatnya.",
                    icon: "success",
                }).then((e) => {
                    $('#orderModal').modal('hide')
                });
            } else {
                const errorText = []
                const obj = response.errors
                for (const key in obj) {
                    console.log(`${key}: ${obj[key]}`);
                    obj[key].forEach(e => {
                        errorText.push(e)
                    });
                }
                const ul = `
                <ul>
                    ${errorText.map(e => `<li>${e}</li>`).join('')}
                </ul>
                `;
                $('.alert').removeClass('d-none')
                $('.alert').html(ul)
            }
        })
    }
});
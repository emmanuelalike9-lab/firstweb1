// Cart Page Functionality

function loadCart() {
    const cartItems = getCartItems();
    const cartTableBody = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyMessage');
    const tableElement = document.querySelector('.items-table');

    if (!cartTableBody) {
        return;
    }

    cartTableBody.innerHTML = '';

    if (cartItems.length === 0) {
        if (tableElement) tableElement.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
        updateCartTotals();
        return;
    }

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'cart-item';
        row.setAttribute('data-product-id', item.id);

        row.innerHTML = `
            <td class="product-name">${item.name}</td>
            <td class="price">₦${Number(item.price || 0).toLocaleString()}</td>
            <td class="quantity">
                <button class="qty-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1">
                <button class="qty-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
            </td>
            <td class="item-total">₦${((Number(item.price || 0) * Number(item.quantity || 1))).toLocaleString()}</td>
            <td class="action">
                <button class="remove-btn" onclick="removeItem('${item.id}')">Remove</button>
            </td>
        `;

        cartTableBody.appendChild(row);
    });

    if (tableElement) tableElement.style.display = 'table';
    if (emptyMessage) emptyMessage.style.display = 'none';
    updateCartTotals();
}

function updateQuantity(productId, change) {
    let cart = getCartItems();
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity = Math.max(1, Number(item.quantity || 1) + Number(change || 0));
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeItem(productId) {
    let cart = getCartItems();
    const item = cart.find(item => item.id === productId);
    const itemName = item ? item.name : 'Item';

    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${itemName} removed from cart`);
    loadCart();
}

function updateCartTotals() {
    let subtotal = 0;
    const cartItems = getCartItems();

    cartItems.forEach(item => {
        subtotal += Number(item.price || 0) * Number(item.quantity || 1);
    });

    const deliveryFee = subtotal * 0.130;
    const total = subtotal + deliveryFee;

    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('Delivery_fee');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `₦${deliveryFee.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;
}

function checkEmptyCart() {
    const cartItems = getCartItems();
    const emptyMessage = document.getElementById('emptyMessage');
    const tableElement = document.querySelector('.items-table');

    if (cartItems.length === 0) {
        if (tableElement) tableElement.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
    } else {
        if (tableElement) tableElement.style.display = 'table';
        if (emptyMessage) emptyMessage.style.display = 'none';
    }
}

const NIGERIAN_LOCATION_DATA = {
    'Abia State': {
        lgas: ['Aba North', 'Aba South', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obingwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umuezeala', 'Umu-Nneochi'],
        cities: ['Aba', 'Umuahia', 'Ohafia', 'Ukwa', 'Isiala Ngwa']
    },
    'Abuja': {
        lgas: ['Abaji', 'AMAC', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
        cities: ['Abuja', 'Gwagwalada', 'Kuje', 'Kwali']
    },
    'Adamawa State': {
        lgas: ['Demsa', 'Fufore', 'Ganye', 'Girei', 'Gombi', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo-Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
        cities: ['Yola', 'Mubi', 'Numan', 'Ganye']
    },
    'Akwa Ibom State': {
        lgas: ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat Enin', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'],
        cities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron']
    },
    'Anambra State': {
        lgas: ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
        cities: ['Awka', 'Onitsha', 'Nnewi', 'Aguata']
    },
    'Bauchi State': {
        lgas: ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'],
        cities: ['Bauchi', 'Azare', 'Misau', 'Katagum']
    },
    'Bayelsa State': {
        lgas: ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
        cities: ['Yenagoa', 'Brass', 'Ogbia', 'Sagbama']
    },
    'Benue State': {
        lgas: ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
        cities: ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala']
    },
    'Borno State': {
        lgas: ['Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
        cities: ['Maiduguri', 'Biu', 'Dikwa', 'Gwoza']
    },
    'Cross River State': {
        lgas: ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
        cities: ['Calabar', 'Ikom', 'Ogoja', 'Obubra']
    },
    'Delta State': {
        lgas: ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
        cities: ['Warri', 'Asaba', 'Sapele', 'Ughelli']
    },
    'Ebonyi State': {
        lgas: ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
        cities: ['Abakaliki', 'Afikpo', 'Onueke', 'Ezza']
    },
    'Edo State': {
        lgas: ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
        cities: ['Benin City', 'Auchi', 'Uromi', 'Ekpoma']
    },
    'Ekiti State': {
        lgas: ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido/Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Moba', 'Oye'],
        cities: ['Ado Ekiti', 'Ikere', 'Ikole', 'Ijero']
    },
    'Enugu State': {
        lgas: ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'],
        cities: ['Enugu', 'Nsukka', 'Agbani', 'Udi']
    },
    'Gombe State': {
        lgas: ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
        cities: ['Gombe', 'Kaltungo', 'Billiri', 'Dukku']
    },
    'Imo State': {
        lgas: ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Onuimo', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West'],
        cities: ['Owerri', 'Orlu', 'Okigwe', 'Aba']
    },
    'Jigawa State': {
        lgas: ['Auyo', 'Babura', 'Biriniwa', 'Birni Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankatsare'],
        cities: ['Dutse', 'Hadejia', 'Kazaure', 'Birnin Kudu']
    },
    'Kaduna State': {
        lgas: ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zaria'],
        cities: ['Kaduna', 'Zaria', 'Kafanchan', 'Sokoto']
    },
    'Kano State': {
        lgas: ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Makarfi', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
        cities: ['Kano', 'Dala', 'Nassarawa', 'Gaya']
    },
    'Katsina State': {
        lgas: ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dan Musa', 'Dandume', 'Danja', 'Daura', 'Dutsi', 'Dutsin-Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
        cities: ['Katsina', 'Funtua', 'Daura', 'Dutsin-Ma']
    },
    'Kebbi State': {
        lgas: ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'],
        cities: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru']
    },
    'Kogi State': {
        lgas: ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela-Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa-Muro', 'Ofu', 'Ogori/Mangongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
        cities: ['Lokoja', 'Okene', 'Anyigba', 'Kabba']
    },
    'Kwara State': {
        lgas: ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
        cities: ['Ilorin', 'Offa', 'Kaiama', 'Jebba']
    },
    'Lagos State': {
        lgas: ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
        cities: ['Lagos', 'Ikeja', 'Ikorodu', 'Lekki']
    },
    'Nasarawa State': {
        lgas: ['Akwanga', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Eggon', 'Obi', 'Toto', 'Wamba'],
        cities: ['Lafia', 'Keffi', 'Nasarawa', 'Akwanga']
    },
    'Niger State': {
        lgas: ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
        cities: ['Minna', 'Bida', 'Suleja', 'Kontagora']
    },
    'Ogun State': {
        lgas: ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Yewa North', 'Yewa South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu'],
        cities: ['Abeokuta', 'Sagamu', 'Ijebu Ode', 'Ota']
    },
    'Ondo State': {
        lgas: ['Akoko North-East', 'Akoko North-West', 'Akoko South-West', 'Akoko South-East', 'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
        cities: ['Akure', 'Ondo', 'Owo', 'Ikare']
    },
    'Osun State': {
        lgas: ['Aiyedire', 'Akinyele', 'Atakunmosa East', 'Atakunmosa West', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Egbedore', 'Ejigbo', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
        cities: ['Osogbo', 'Ilesa', 'Iwo', 'Ede']
    },
    'Oyo State': {
        lgas: ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomosho North', 'Ogbomosho South', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
        cities: ['Ibadan', 'Ogbomosho', 'Oyo', 'Saki']
    },
    'Plateau State': {
        lgas: ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua an Pan', 'Riyom', 'Shendam', 'Wase'],
        cities: ['Jos', 'Pankshin', 'Shendam', 'Mangu']
    },
    'Rivers State': {
        lgas: ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
        cities: ['Port Harcourt', 'Bonny', 'Ahoada', 'Obio/Akpor']
    },
    'Sokoto State': {
        lgas: ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Illela', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
        cities: ['Sokoto', 'Tambuwal', 'Gwadabawa', 'Bodinga']
    },
    'Taraba State': {
        lgas: ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kumi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
        cities: ['Jalingo', 'Wukari', 'Takum', 'Bali']
    },
    'Yobe State': {
        lgas: ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
        cities: ['Damaturu', 'Potiskum', 'Nguru', 'Gujba']
    },
    'Zamfara State': {
        lgas: ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Kaura Namoda', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Chafe', 'Zurmi'],
        cities: ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Maru']
    }
};

function populateStates() {
    const stateSelect = document.getElementById('customerState');
    const lgaSelect = document.getElementById('customerLga');
    if (!stateSelect) return;

    if (lgaSelect) lgaSelect.innerHTML = '<option value="">Select an LGA</option>';

    stateSelect.innerHTML = '<option value="">Select your state</option>';

    Object.keys(NIGERIAN_LOCATION_DATA).sort((a, b) => a.localeCompare(b)).forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

function populateLocalGovernments(selectedState) {
    const lgaSelect = document.getElementById('customerLga');
    if (!lgaSelect) return;

    lgaSelect.innerHTML = '<option value="">Select your LGA</option>';

    if (!selectedState) {
        return;
    }

    const stateData = NIGERIAN_LOCATION_DATA[selectedState];
    const lgas = stateData && Array.isArray(stateData.lgas) ? stateData.lgas : [];

    if (!lgas.length) {
        const fallbackOption = document.createElement('option');
        fallbackOption.value = selectedState;
        fallbackOption.textContent = 'No LGAs available';
        lgaSelect.appendChild(fallbackOption);
        return;
    }

    lgas.forEach(lga => {
        const option = document.createElement('option');
        option.value = lga;
        option.textContent = lga;
        lgaSelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutFormSection = document.getElementById('checkoutFormSection');
    const stateSelect = document.getElementById('customerState');

    populateStates();

    if (stateSelect) {
        stateSelect.addEventListener('change', function() {
            populateLocalGovernments(this.value);
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cartItems = getCartItems();
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add items before checking out.');
                return;
            }

            if (checkoutFormSection) {
                checkoutFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (checkoutForm) {
                const firstField = checkoutForm.querySelector('input, textarea, select');
                if (firstField) firstField.focus();
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }

            if (!localStorage.getItem('authToken')) {
                const formData = {
                    customerName: document.getElementById('customerName').value.trim(),
                    customerPhone: document.getElementById('customerPhone').value.trim(),
                    customerState: document.getElementById('customerState').value,
                    customerLga: document.getElementById('customerLga').value,
                    customerAddress: document.getElementById('customerAddress').value.trim(),
                    customerDirections: document.getElementById('customerDirections').value.trim(),
                    customerNote: document.getElementById('customerNote').value.trim()
                };
                localStorage.setItem('pendingCheckoutData', JSON.stringify(formData));
                window.location.href = 'signup.html';
                return;
            }

            const cartItems = getCartItems();
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add items before placing an order.');
                return;
            }

            // alert('Thank you! Your order has been placed successfully.');
            clearCart();
            loadCart();
            checkoutForm.reset();
            populateStates();
        });
    }

    document.addEventListener('change', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('qty-input')) {
            const row = e.target.closest('.cart-item');
            if (!row) return;

            const productId = row.getAttribute('data-product-id');
            const inputValue = Number(e.target.value || 1);
            const cart = getCartItems();
            const item = cart.find(item => item.id === productId);

            if (item) {
                item.quantity = Math.max(1, inputValue);
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCart();
            }
        }
    });

    loadCart();
});

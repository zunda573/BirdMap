const supabaseUrl =
    "https://joxazhcjwasgpknxufif.supabase.co";

const supabaseKey =
    "sb_publishable_lmDUsTIEnmiFnic3yH16NA_NrRNst4F";

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );

    console.log("Supabase接続テスト");
console.log("Supabase Client:", supabaseClient);

async function testSupabaseConnection(){

    const result =
        await supabaseClient.auth.getUser();

    console.log(
        "Supabase Auth:",
        result
    );

}

testSupabaseConnection();

document
.getElementById("loginButton")
.addEventListener(
    "click",
    function(){

        document
        .getElementById("authPanel")
        .style.display = "block";

    }
);
document
.getElementById("logoutButton")
.addEventListener(
    "click",
    async function(){

        await supabaseClient.auth.signOut();

        updateLoginStatus();

    }
);

document
.getElementById("closeAuthButton")
.addEventListener(
    "click",
    function(){

        document
        .getElementById("authPanel")
        .style.display = "none";

        document
        .getElementById("authOverlay")
        .style.display = "none";

    }
);

document
.getElementById("closeAuthButton")
.addEventListener(
    "click",
    function(){

        document
        .getElementById("authPanel")
        .style.display = "none";

        document
        .getElementById("authOverlay")
        .style.display = "none";

    }
);

document
.getElementById("signUpButton")
.addEventListener(
    "click",
    async function(){

        const email =
            document
            .getElementById("emailInput")
            .value
            .trim();

        const password =
            document
            .getElementById("passwordInput")
            .value;

        if(!email || !password){

            alert(
                "メールアドレスとパスワードを入力してください"
            );

            return;
        }

        const result =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });

        if(result.error){

            console.error(
                "新規登録エラー：",
                result.error
            );

            alert(
                "新規登録に失敗しました。\n" +
                result.error.message
            );

            return;
        }

        alert(
            "新規登録が完了しました。\n" +
            "確認メールを確認してください。"
        );

    }
);

document
.getElementById("signInButton")
.addEventListener(
    "click",
    async function(){

        const email =
            document
            .getElementById("emailInput")
            .value
            .trim();

        const password =
            document
            .getElementById("passwordInput")
            .value;

        if(!email || !password){

            alert(
                "メールアドレスとパスワードを入力してください"
            );

            return;
        }

        const result =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if(result.error){

            console.error(
                "ログインエラー：",
                result.error
            );

            alert(
                "ログインに失敗しました。\n" +
                result.error.message
            );

            return;
        }

        await updateLoginStatus();

        document
        .getElementById("authPanel")
        .style.display = "none";

        document
        .getElementById("authOverlay")
        .style.display = "none";

        alert("ログインしました。");

    }
);

async function updateLoginStatus(){

    const result =
        await supabaseClient.auth.getUser();

    const user =
        result.data.user;

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    const loginStatus =
        document.getElementById(
            "loginStatus"
        );

    if(user){

        loginButton.style.display =
            "none";

        logoutButton.style.display =
            "inline-block";

        loginStatus.textContent =
            "ログイン中：" +
            user.email;

    }else{

        loginButton.style.display =
            "inline-block";

        logoutButton.style.display =
            "none";

        loginStatus.textContent =
            "ログインしていません";

    }

}

updateLoginStatus();

        const map = L.map('map').setView([35.6812, 139.7671], 13);

        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 19
            }
        ).addTo(map);

        let birds = JSON.parse(
            localStorage.getItem("birds")
        ) || [];

        let selectedBirds = [];

        let currentStartDate = "";

        let currentEndDate = "";

        let sortMode = "count";

        let markers = [];

        function saveBirds() {
            localStorage.setItem(
                "birds",
                JSON.stringify(birds)
            );
        }

        async function saveBirdToSupabase(bird) {

    const { error } =
        await supabaseClient
        .from("birds")
        .insert({
            name: bird.name,
            date: bird.date,
            lat: bird.lat,
            lng: bird.lng,
            user_id: bird.user_id
        });

    if(error){

        console.error(
            "Supabase保存エラー：",
            error
        );

        alert(
            "Supabaseへの保存に失敗しました。\n" +
            error.message
        );

        return false;
    }

    return true;
}

function createMarker(bird) {

    const marker = L.marker([
        bird.lat,
        bird.lng
    ]);

    markers.push({
    bird: bird,
    marker: marker
});


    marker
    .addTo(map)
    .bindPopup(
    "<div style='font-size:16px;font-weight:bold;color:darkblue;'>" +
    bird.name +
    "</div>" +
    "<div>観察日：" +
    bird.date +
    "</div>"
);

    marker.on("mouseover", function() {
    marker.openPopup();
});

marker.on("mouseout", function() {
    marker.closePopup();
});

    marker.on('click', function() {

        if (confirm(
            bird.name +
            " を削除しますか？"
        )) {

            map.removeLayer(marker);

birds = birds.filter(function(item) {

    return !(
        item.name === bird.name &&
        item.lat === bird.lat &&
        item.lng === bird.lng
    );

});

            saveBirds();
            updateSpeciesList();
        }

    });

}

        birds.forEach(function(bird) {
            createMarker(bird);
        });

let clickedLatLng = null;

map.on('click', function(e) {

    clickedLatLng = e.latlng;

    document.getElementById(
        "birdForm"
    ).style.display = "block";

});

        function updateSpeciesList() {

            const listDiv =
                document.getElementById(
                    "speciesList"
                );

                selectedBirds = [];

document
.querySelectorAll(".birdFilter:checked")
.forEach(function(box){

    selectedBirds.push(
        box.value
    );

});

            let counts = {};

            birds.forEach(function(bird) {

                if (!counts[bird.name]) {
                    counts[bird.name] = 0;
                }

                counts[bird.name]++;

            });

           let html =
    "<h3>種一覧</h3>" +

"<button onclick='sortByCount()'>" +
"観察回数順" +
"</button> " +

"<button onclick='sortByName()'>" +
"五十音順" +
"</button><br><br>" +


    "<button onclick='filterSelectedBirds()'>" +
    "選択種のみ表示" +
    "</button> " +

    "<button onclick='showAllBirds()'>" +
    "全表示" +
    "</button><br><br>"+

    "<button onclick='toggleDatePanel()'>" +
    "期間絞り込み" +
    "</button><br><br>" +

    "<button onclick='applyFilters()'>" +
    "絞り込み実行" +
    "</button> " +

    "<button onclick='clearDateFilter()'>" +
    "期間解除" +
    "</button><br><br>";


    let sortedNames;



if(sortMode === "count"){

    sortedNames =
        Object.keys(counts).sort(
            function(a, b){

                const diff =
                    counts[b] - counts[a];

                if(diff !== 0){
                    return diff;
                }

                return a.localeCompare(
                    b,
                    "ja"
                );

            }
        );

}else{

    sortedNames =
        Object.keys(counts).sort(
            function(a, b){

                return a.localeCompare(
                    b,
                    "ja"
                );

            }
        );

}


            sortedNames.forEach(function(name){

const photo =
    localStorage.getItem(
        "photo_" + name
    );

html +=
    "<div style='margin-bottom:10px'>" +
    "<p>" +

    "<input type='checkbox' class='birdFilter' value='" +
    name +
    "' " +
    (
        selectedBirds.includes(name)
        ? "checked"
        : ""
    ) +
    "> " +

    "<span style='cursor:pointer;color:blue' onclick=\"showBirdDetail('" +
    name +
    "')\">" +
    name +
    "</span>" +

    " (" +
    counts[name] +
    "件) " +

    "<button onclick=\"uploadPhoto('" +
    name +
    "')\">写真登録</button>" +

    "</p>";
if(photo){

    html +=
    "<img src='" +
    photo +
    "' width='150'>";

}

html += "</div>";

            });

            listDiv.innerHTML = html;
        }

        document
            .getElementById("listButton")
            .addEventListener(
                "click",
                function() {

                    const list =
                        document.getElementById(
                            "speciesList"
                        );

                    if (
                        list.style.display ===
                        "none"
                    ) {

                        updateSpeciesList();

                        list.style.display =
                            "block";

                    } else {

                        list.style.display =
                            "none";

                    }

                }
            );

document
.getElementById("saveBirdButton")
.addEventListener("click", async function(){

    const birdName =
        document.getElementById(
            "birdNameInput"
        ).value;

    const birdDate =
        document.getElementById(
            "birdDateInput"
        ).value;

    if(!birdName || !birdDate){
        alert(
            "鳥名と観察日を入力してください"
        );
        return;
    }

const result =
    await supabaseClient.auth.getUser();

const user =
    result.data.user;

const bird = {
    name: birdName,
    date: birdDate,
    lat: clickedLatLng.lat,
    lng: clickedLatLng.lng,
    user_id: user ? user.id : null
};

birds.push(bird);

createMarker(bird);

saveBirds();

if(bird.user_id){

    async function saveBirdToSupabase(bird);

}

    updateSpeciesList();

    document.getElementById(
        "birdForm"
    ).style.display = "none";

    document.getElementById(
        "birdNameInput"
    ).value = "";

    document.getElementById(
        "birdDateInput"
    ).value = "";

});
document
.getElementById("cancelBirdButton")
.addEventListener("click", function(){

    document.getElementById(
        "birdForm"
    ).style.display = "none";

});
            function uploadPhoto(birdName) {
    const input =
        document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = function(event) {

        const file =
            event.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload = function(e) {

            localStorage.setItem(
                "photo_" + birdName,
                e.target.result
            );

            alert(
                birdName +
                " の写真を保存しました！"
            );

            updateSpeciesList();

        };

        reader.readAsDataURL(file);

    };

    input.click();

}
document
.getElementById("searchButton")
.addEventListener("click", function(){

    const place =
        document.getElementById(
            "searchBox"
        ).value;

    if(!place){
        return;
    }

    fetch(
        "https://nominatim.openstreetmap.org/search?format=json&q="
        + encodeURIComponent(place)
    )
    .then(response => response.json())
    .then(data => {

        if(data.length === 0){

            alert(
                "場所が見つかりません"
            );

            return;
        }

        const lat =
            parseFloat(data[0].lat);

        const lon =
            parseFloat(data[0].lon);

        map.setView(
            [lat, lon],
            15
        );

    });

});
function showBirdDetail(birdName){

    const records =
        birds.filter(function(bird){

            return bird.name === birdName;

        });

    let html =
        "<h2>" +
        birdName +
        "</h2>";

    const photo =
        localStorage.getItem(
            "photo_" + birdName
        );

    if(photo){

        html +=
        "<img src='" +
        photo +
        "' width='250'><br><br>";

    }

    html +=
        "<b>観察回数：</b>" +
        records.length +
        "回<br><br>";

    const dates =
        records.map(r => r.date).sort();

    html +=
        "<b>最初の観察日：</b><br>" +
        dates[0] +
        "<br><br>";

    html +=
        "<b>最新の観察日：</b><br>" +
        dates[dates.length - 1] +
        "<br><br>";

    html +=
        "<b>観察履歴</b><br>";

    records.forEach(function(record){

        html +=
            record.date +
            "<br>";

    });

    document.getElementById(
        "birdDetailContent"
    ).innerHTML = html;

   document.getElementById(
    "statsPanel"
).style.display = "none";

    document.getElementById(
        "birdDetail"
    ).style.display = "block";

}

document
.getElementById("exportButton")
.addEventListener("click", function(){

    const data =
        JSON.stringify(
            birds,
            null,
            2
        );

    const blob =
        new Blob(
            [data],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "bird_backup.json";

    a.click();

    URL.revokeObjectURL(url);

});

document
.getElementById("importButton")
.addEventListener("click", function(){

    document
    .getElementById(
        "importFile"
    )
    .click();

});

document
.getElementById("importFile")
.addEventListener("change", function(event){

    const file =
        event.target.files[0];

    if(!file){
        return;
    }

    const reader =
        new FileReader();

    reader.onload =
    function(e){

        try{

            birds =
            JSON.parse(
                e.target.result
            );

            localStorage.setItem(
                "birds",
                JSON.stringify(
                    birds
                )
            );

            alert(
                "復元しました。ページを再読み込みしてください。"
            );

        }catch{

            alert(
                "ファイルが正しくありません"
            );

        }

    };

    reader.readAsText(file);

});

function sortByCount(){

    sortMode = "count";

    updateSpeciesList();

}

function sortByName(){

    sortMode = "name";

    updateSpeciesList();

}

function filterSelectedBirds(){


    applyFilters();

}

function showAllBirds(){

    selectedBirds = [];

    document
    .querySelectorAll(
        ".birdFilter"
    )
    .forEach(function(box){

        box.checked = false;

    });

    applyFilters();

}

document
.getElementById("statsButton")
.addEventListener("click", function(){

    const panel =
        document.getElementById(
            "statsPanel"
        );

    if(
        panel.style.display ===
        "none"
    ){

        document.getElementById(
            "birdDetail"
        ).style.display = "none";

        panel.style.display =
            "block";

    }else{

        panel.style.display =
            "none";

    }

});

function showBasicStats(){

    const speciesCount =
        new Set(
            birds.map(
                bird => bird.name
            )
        ).size;

    let latestDate = "";

    if(birds.length > 0){

        latestDate =
            birds
            .map(
                bird => bird.date
            )
            .sort()
            .pop();

    }

    document
    .getElementById(
        "statsContent"
    )
    .innerHTML =

        "<b>総観察数：</b>" +
        birds.length +
        "件<br><br>" +

        "<b>観察種数：</b>" +
        speciesCount +
        "種<br><br>" +

        "<b>最新観察日：</b><br>" +
        latestDate;

}

function showRankingStats(){

    const counts = {};

    birds.forEach(function(bird){

        if(!counts[bird.name]){

            counts[bird.name] = 0;

        }

        counts[bird.name]++;

    });

    const ranking =
        Object.keys(counts)
        .sort(function(a,b){

            return counts[b] -
                   counts[a];

        });

    let html =
        "<h4>観察数ランキング</h4>";

    ranking.forEach(function(name,index){

        html +=
            (index + 1) +
            "位 " +
            name +
            " : " +
            counts[name] +
            "件<br>";

    });

    document
    .getElementById(
        "statsContent"
    )
    .innerHTML = html;

}

function clearDateFilter(){

    document.getElementById(
        "startDate"
    ).value = "";

    document.getElementById(
        "endDate"
    ).value = "";

    currentStartDate = "";
    currentEndDate = "";

    applyFilters();

}

function filterByDate(){


    applyFilters();

}

function applyFilters(){

    const selected = [];

    document
    .querySelectorAll(
        ".birdFilter:checked"
    )
    .forEach(function(box){

        selected.push(
            box.value
        );

    });

    const startDate =
        document.getElementById(
            "startDate"
        ).value;

    const endDate =
        document.getElementById(
            "endDate"
        ).value;

        currentStartDate = startDate;
        currentEndDate = endDate;

    markers.forEach(function(item){

        const bird =
            item.bird;

        const speciesMatch =
            selected.length === 0 ||
            selected.includes(
                bird.name
            );

        const dateMatch =
            (
                !startDate ||
                bird.date >= startDate
            )
            &&
            (
                !endDate ||
                bird.date <= endDate
            );

        if(
            speciesMatch &&
            dateMatch
        ){

            item.marker.addTo(map);

        }else{

            map.removeLayer(
                item.marker
            );

        }

    });

}

function toggleDatePanel(){

    const overlay =
        document.getElementById(
            "modalOverlay"
        );

    if(
        overlay.style.display
        === "block"
    ){

        overlay.style.display =
            "none";

    }else{

        overlay.style.display =
            "block";

    }

}
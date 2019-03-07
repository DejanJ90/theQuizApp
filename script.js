/***QUIZ CONTROLLER***/
var quizController = (function () {

    /***QUESTION CONSTRUCTOR***/

    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    };

    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem("questionCollection"));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem("questionCollection");
        }
    };

    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    };

    var quizProgress = {
        questionIndex: 0
    }

    /***PERSON CONSTRUCTOR***/

    function Person(id, firstName, lastName, score) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.score = score;
    };

    var currPersonData = {
        fullName: [],
        score: 0
    };

    var adminFullName = ["Dejan", "Jurisic"];

    var personLocalStorage = {
        setPersonCollection: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonCollection: function () {
            return JSON.parse(localStorage.getItem("personData"));
        },
        removePersonCollection: function () {
            localStorage.removeItem("personData");
        }
    };

    if (personLocalStorage.getPersonCollection() === null) {
        personLocalStorage.setPersonCollection([]);
    };

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function (newQuestionText, options) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            };

            optionsArr = [];
            isChecked = false;

            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            };

            for (var i = 0; i < options.length; i++) {

                if (options[i].value !== "") {
                    optionsArr.push(options[i].value);
                };

                if (options[i].value !== "" && options[i].previousElementSibling.checked) {
                    corrAns = options[i].value;
                    isChecked = true;
                };
            };

            if (newQuestionText.value !== "") {
                if (optionsArr.length > 1) {
                    if (isChecked) {
                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestionText.value = "";

                        for (var x = 0; x < options.length; x++) {
                            options[x].value = "";
                            options[x].previousElementSibling.checked = false;
                        };

                        return true

                    } else {
                        alert("You missed to check correct answer, or you checked answer without value");
                        return false
                    };
                } else {
                    alert("You must insert at least two options");
                    return false
                };
            } else {
                alert("Please, Insert Question");
                return false
            };
        },

        checkAnswer: function (answer) {

            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer.textContent) {

                currPersonData.score++;

                return true;
            } else {
                return false;
            };
        },

        isFinished: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function () {
            var newPerson, personId, personData;

            if (personLocalStorage.getPersonCollection().length > 0) {
                personId = personLocalStorage.getPersonCollection()[personLocalStorage.getPersonCollection().length - 1].id + 1;
            } else {
                personId = 0;
            };

            newPerson = new Person(personId, currPersonData.fullName[0], currPersonData.fullName[1], currPersonData.score);

            personData = personLocalStorage.getPersonCollection();
            personData.push(newPerson);
            personLocalStorage.setPersonCollection(personData);
        },

        getCurrentPersonData: currPersonData,

        getAdminFullName: adminFullName,

        getPersonLocalStorage: personLocalStorage
    };

})();

/***UI CONTROLLER***/
var UIController = (function () {

    var domItems = {

        /***Landing Page Elements***/
        landingPageSection: document.querySelector(".landing-page-container"),
        landingInputWrapper: document.querySelector(".landing-inputs-wrapper"),
        firstNameInput: document.getElementById("firstname"),
        lastNameInput: document.getElementById("lastname"),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        /***Admin Panel Elements***/
        adminPanelSection: document.querySelector(".admin-panel-container"),
        questionInsertBtn: document.getElementById("question-insert-btn"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionClearBtn: document.getElementById("questions-clear-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
        resultsListWrapper: document.querySelector(".results-list-wrapper"),
        resultClearBtn: document.getElementById("results-clear-btn"),
        /***Quiz Elements ***/
        startQuiz: document.querySelector(".quiz-container"),
        askedQuestionText: document.getElementById("asked-question-text"),
        quizOptionWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progress"),
        instantAnswerContainer: document.querySelector(".instant-answer-container"),
        emotionIcon: document.getElementById("emotion"),
        instantAnswerWrapper: document.getElementById("instant-answer-wrapper"),
        instantAnswerText: document.getElementById("instant-answer-text"),
        nextQuestionBtn: document.getElementById("next-question-btn"),
        /***Final Result Page Elements***/
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById("final-score-text"),
        finalLogOutBtn: document.getElementById("final-logout-btn")
    };

    return {

        getDomItem: domItems,

        addInputsDynamically: function () {

            var addInput = function () {
                var inputHTML, id;

                id = document.querySelectorAll(".admin-option").length;

                inputHTML = '<div class="admin-option-wrapper"> <input type="radio" class="admin-option-"' + id + ' name="answer" value="0"><input type="text" class="admin-option admin-option-"' + id + ' value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML("beforeend", inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener("focus", addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInput);
            };

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInput);
        },

        createQuestionList: function (getQuestions) {
            var questionHTML, questions;

            domItems.insertedQuestionsWrapper.innerHTML = "";
            questions = getQuestions.getQuestionCollection();

            for (var i = 0; i < questions.length; i++) {

                questionHTML = '<p><span>' + (i + 1) + '. ' + questions[i].questionText + '</span><button id="question-' + questions[i].id + '">Edit</button></p>'
                domItems.insertedQuestionsWrapper.insertAdjacentHTML("afterbegin", questionHTML);
            };

        },

        editQuestionList: function (event, storageQuestList, addInputsDynFn, updateQuestListDynFn) {
            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

            domItems.questionInsertBtn.style.visibility = "hidden";
            domItems.questionClearBtn.style.pointerEvents = "none";
            domItems.questionUpdateBtn.style.visibility = "visible";
            domItems.questionDeleteBtn.style.visibility = "visible";

            if ("question-".indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split("-")[1]);

                getStorageQuestList = storageQuestList.getQuestionCollection();

                for (var i = 0; i < getStorageQuestList.length; i++) {
                    if (getId === getStorageQuestList[i].id) {

                        foundItem = getStorageQuestList[i];
                        placeInArr = i
                    };
                };

                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = "";
                optionHTML = "";

                for (var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"> <input type="radio" class="admin-option-"' + x + ' name="answer" value="0"><input type="text" class="admin-option admin-option-"' + x + ' value="' + foundItem.options[x] + '"></div>';
                };

                domItems.adminOptionsContainer.innerHTML = optionHTML;
                addInputsDynFn();

                var backDefaultView = function () {
                    domItems.newQuestionText.value = "";
                    domItems.adminOptionsContainer.innerHTML = "";

                    for (var i = 0; i < 2; i++) {
                        inputHTML = '<div class="admin-option-wrapper"> <input type="radio" class="admin-option-"' + i + ' name="answer" value="0"><input type="text" class="admin-option admin-option-"' + i + ' value=""></div>';
                        domItems.adminOptionsContainer.insertAdjacentHTML("beforeend", inputHTML);
                    };

                    addInputsDynFn();

                    domItems.questionInsertBtn.style.visibility = "visible";
                    domItems.questionClearBtn.style.pointerEvents = "";
                    domItems.questionUpdateBtn.style.visibility = "hidden";
                    domItems.questionDeleteBtn.style.visibility = "hidden";

                    updateQuestListDynFn(storageQuestList)
                };

                var updateQuestion = function () {
                    var newOptions, optionEls, inputHTML;

                    newOptions = [];
                    optionEls = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = "";

                    for (var i = 0; i < optionEls.length; i++) {

                        if (optionEls[i].value !== "") {
                            newOptions.push(optionEls[i].value);
                        };

                        if (optionEls[i].previousElementSibling.checked) {
                            foundItem.correctAnswer = optionEls[i].value;
                        };
                    };

                    foundItem.options = newOptions;

                    if (foundItem.questionText !== "") {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correctAnswer !== "") {

                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);

                                backDefaultView()

                            } else {
                                alert("You missed to check correct answer, or you checked answer without value")
                            };
                        } else {
                            alert("You must insert at least two options");
                        };
                    } else {
                        alert("Please, Insert Question");
                    };
                };

                domItems.questionUpdateBtn.onclick = updateQuestion;

                var deleteQuestion = function () {

                    getStorageQuestList.splice(placeInArr, 1)

                    for (var i = 0; i < getStorageQuestList.length; i++) {
                        if (getStorageQuestList[i].id !== i) {
                            getStorageQuestList[i].id = i
                        }
                    };

                    storageQuestList.setQuestionCollection(getStorageQuestList);

                    backDefaultView()
                };

                domItems.questionDeleteBtn.onclick = deleteQuestion;
            };
        },

        clearQuestionList: function (storageQuestion) {
            if (storageQuestion.getQuestionCollection() !== null) {
                if (storageQuestion.getQuestionCollection().length > 0) {
                    var conf = confirm("Warning! You will lose entire question list!");

                    if (conf) {
                        storageQuestion.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = "";

                    };
                };
            };

        },

        displayQuestion: function (storageQuestList, progress) {
            var newOptionsHTML, characterArr

            characterArr = ["A", "B", "C", "D", "E", "F"]

            if (storageQuestList.getQuestionCollection().length > 0) {

                domItems.askedQuestionText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionWrapper.innerHTML = "";

                for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionsHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p>';
                    domItems.quizOptionWrapper.insertAdjacentHTML("beforeend", newOptionsHTML);
                };
            };

        },

        displayProgress: function (storageQuestList, progress) {

            domItems.progressPar.textContent = (progress.questionIndex + 1) + "/" + storageQuestList.getQuestionCollection().length;
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
        },

        newDesign: function (answerResult, selectedAnswer) {
            var twoOptions, index;

            index = 0;

            if (answerResult) {
                index = 1;
            };

            domItems.quizOptionWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";
            domItems.instantAnswerContainer.style.opacity = "1";

            twoOptions = {
                emotionType: ["images/sad.png", "images/happy.png"],
                instantAnsClass: ["red", "green"],
                instantAnsText: ["This is a wrong answer", "This is a correct answer"],
                optionSpanBg: ["rgba(200, 0, 0, .7)", "rgba(0, 250, 0, .2)"]
            };

            domItems.emotionIcon.setAttribute("src", twoOptions.emotionType[index]);
            domItems.instantAnswerWrapper.className = twoOptions.instantAnsClass[index];
            domItems.instantAnswerText.textContent = twoOptions.instantAnsText[index];
            selectedAnswer.previousElementSibling.style.background = twoOptions.optionSpanBg[index]

        },

        resetDesign: function () {
            domItems.quizOptionWrapper.style.cssText = "";
            domItems.instantAnswerContainer.style.opacity = "0";
        },

        getFullName: function (currPerson, storageQuestionList, admin) {

            if (domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {
                if (!(admin[0] === domItems.firstNameInput.value && admin[1] === domItems.lastNameInput.value)) {
                    if (storageQuestionList.getQuestionCollection().length > 0) {
                        currPerson.fullName.push(domItems.firstNameInput.value);
                        currPerson.fullName.push(domItems.lastNameInput.value);

                        domItems.landingPageSection.style.display = "none";
                        domItems.startQuiz.style.display = "block";
                    } else {
                        alert("Quiz is not ready, please contact to administration")
                    };

                } else {
                    domItems.landingPageSection.style.display = "none";
                    domItems.adminPanelSection.style.display = "block";
                };
            } else {
                alert("Please enter your first name and last name")
            }
        },

        finalResult: function (currPerson) {

            domItems.finalScoreText.textContent = currPerson.fullName[0] + " " + currPerson.fullName[1] + ", " + "your final score is " + currPerson.score;
            domItems.startQuiz.style.display = " none";
            domItems.finalResultSection.style.display = "block";
        },

        addResultOnPanel: function (userData) {
            var resultHTML, users;

            users = userData.getPersonCollection();

            domItems.resultsListWrapper.innerHTML = "";

            if (users !== null) {
                for (var i = 0; i < users.length; i++) {

                    resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + users[i].firstName + " " + users[i].lastName + " - " + users[i].score + " points" +
                        '</span><button id="delete-result-btn_' + users[i].id + '" class="delete-result-btn">Delete</button></p>';

                    domItems.resultsListWrapper.insertAdjacentHTML("afterbegin", resultHTML);
                };
            };

        },

        deleteResult: function (userData, clickedResult) {
            var clickedId, personArry;

            personArry = userData.getPersonCollection();
            clickedId = parseInt(clickedResult.split("_")[1]);

            personArry.forEach(function (element, index) {

                if (clickedId === element.id) {

                    personArry.splice(index, 1);
                };

            });

            userData.setPersonCollection(personArry);
        },

        clearResultPanel: function (userData) {
            var conf;

            if (userData.getPersonCollection() !== null) {
                if (userData.getPersonCollection().length > 0) {
                    conf = confirm("Warning! You will lose entire result list")

                    if (conf) {
                        userData.removePersonCollection()

                        domItems.resultsListWrapper.innerHTML = "";
                    };
                };
            };
        }

    };

})();

/***CONTROLLER***/
var controller = (function (quizCtrl, UICtrl) {

    var selectedDomItem = UICtrl.getDomItem;

    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItem.questionInsertBtn.addEventListener("click", function () {
        var adminOptions = document.querySelectorAll(".admin-option");

        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItem.newQuestionText, adminOptions);

        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        };

        selectedDomItem.adminOptionsContainer.innerHTML = "";

        for (var i = 0; i < 2; i++) {
            var inputHTML = '<div class="admin-option-wrapper"> <input type="radio" class="admin-option-"' + i + ' name="answer" value="0"><input type="text" class="admin-option admin-option-"' + i + ' value=""></div>';
            selectedDomItem.adminOptionsContainer.insertAdjacentHTML("beforeend", inputHTML);
        }

    });

    selectedDomItem.insertedQuestionsWrapper.addEventListener("click", function (e) {
        UICtrl.editQuestionList(e, quizController.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });

    selectedDomItem.questionClearBtn.addEventListener("click", function () {
        UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItem.quizOptionWrapper.addEventListener("click", function (e) {

        var updateOptionsDiv = selectedDomItem.quizOptionWrapper.querySelectorAll("div")

        for (var i = 0; i < updateOptionsDiv.length; i++) {

            if (e.target.className === "choice-" + i) {

                var answer = document.querySelector(".quiz-options-wrapper div p." + e.target.className);

                var answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {
                    selectedDomItem.nextQuestionBtn.textContent = "Finish"
                }

                var nextQuestion = function (questData, progress) {
                    if (quizCtrl.isFinished()) {

                        quizCtrl.addPerson();
                        UICtrl.finalResult(quizCtrl.getCurrentPersonData);

                    } else {

                        progress.questionIndex++;

                        UICtrl.resetDesign();
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }
                };

                selectedDomItem.nextQuestionBtn.onclick = function () {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                };
            };
        };

    });

    selectedDomItem.startQuizBtn.addEventListener("click", function () {

        UICtrl.getFullName(quizCtrl.getCurrentPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });

    selectedDomItem.landingInputWrapper.addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            UICtrl.getFullName(quizCtrl.getCurrentPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
        }
    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    selectedDomItem.resultsListWrapper.addEventListener("click", function (e) {
        var clickedResult;

        clickedResult = e.target.id

        UICtrl.deleteResult(quizCtrl.getPersonLocalStorage, clickedResult);

        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });

    selectedDomItem.resultClearBtn.onclick = function () {
        UICtrl.clearResultPanel(quizCtrl.getPersonLocalStorage);
    };

})(quizController, UIController);
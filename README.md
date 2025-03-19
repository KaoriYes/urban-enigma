# urban-enigma

## BrowserTech met Vasilis en Krijn

### Week 1

Ik heb in week 1 voornamelijk door het formulier heengelopen om te kijken wat ik wil toepassen in mijn formulier.
Dat heb ik samen met mijn vader gedaan, hierbij zijn we vrij snel naar vraag 12 gegaan: De BOR. Dit is een hele
technische vraag
over bedrijfsregelingen en overnames. Hierbij moeten veel berekeningen gemaakt worden en die berekeningen moeten ook
bewaard worden.

![BORvraag.png](readmeIMG%2FBORvraag.png)

![BORrekentool.png](readmeIMG%2FBORrekentool.png)

### Week 2

In week twee heb ik de eerste opzet voor de HTML gemaakt en een groot deel van de CSS. Hierin ben ik in week drie wel
achter een probleem gekomen. Mobile werd erg slecht ondersteund. Zie week drie. Maar hierin heb ik vooral de basis
neergezet hoe ik mijn HTML. Ik heb vooral gekeken hoe ik hierbij zo veel mogelijk mensen kan voorzien met de correcte
informatie zonder dat de
gebruiker de nieuwste browser of features heeft. Mijn valkuil is hierbij vooral dat ik (te) makkelijk naar de `:has`
selector ga om mijn problemen op te lossen.
Hierdoor moest ik even mijn denkwijze een jaartje terugspoelen en gebruik maken van de meer standaard features in CSS.

Zie bijvoorbeeld hieronder. Hier heb ik vooral met verschillende classes gebruik gemaakt van verschillende requirements.
Zo kon ik met relatief weinig code (performance verbeterend) veel bereiken.

    <fieldset class="question-small single-question-required">
                    <legend>
                        <span class="question-indicator">12c</span> Is er een vooroverleg geweest met de Belastingdienst
                        over de bedrijfsopvolgingsregeling?
                    </legend>
                    <div class="radio-check-box-container">
                        <label class="radio-check-box">
                            Nee
                            <input data-1p-ignore
                                   name="vooroverleg-bor"
                                   required
                                   type="radio"
                                   value="no">
                        </label>
                        <label class="radio-check-box">
                            Ja
                            <input data-1p-ignore
                                   name="vooroverleg-bor"
                                   required
                                   type="radio"
                                   value="yes">
                        </label>
                    </div>
                </fieldset>

Resultaat van de Code zonder css.

<fieldset class="question-small single-question-required">
                <legend>
                    <span class="question-indicator">12c</span> Is er een vooroverleg geweest met de Belastingdienst
                    over de bedrijfsopvolgingsregeling?
                </legend>
                <div class="radio-check-box-container">
                    <label class="radio-check-box">
                        Nee
                        <input data-1p-ignore
                               name="vooroverleg-bor"
                               required
                               type="radio"
                               value="no">
                    </label>
                    <label class="radio-check-box">
                        Ja
                        <input data-1p-ignore
                               name="vooroverleg-bor"
                               required
                               type="radio"
                               value="yes">
                    </label>
                </div>
            </fieldset>
Resultaat met CSS:

![CSS12c.png](readmeIMG%2FCSS12c.png)


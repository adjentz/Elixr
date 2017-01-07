import CreatureEditor from "creature-editor/creature-editor";
import creatureDescription = require("creature-editor/creature-description/creature-description");
import creatureAbilities = require("creature-editor/creature-abilities/creature-abilities");
import creatureEnergy = require("creature-editor/creature-energy/creature-energy");
import creatureDefense = require("creature-editor/creature-defense/creature-defense");
import creatureWeapons = require("creature-editor/creature-weapons/creature-weapons");
import creatureWealth = require("creature-editor/creature-wealth/creature-wealth");
import creatureItems = require("creature-editor/creature-items/creature-items");
import creatureFeatures = require("creature-editor/creature-features/creature-features");
import creatureFlaws = require("creature-editor/creature-flaws/creature-flaws");
import creatureOaths = require("creature-editor/creature-oaths/creature-oaths");
import creatureSpells = require("creature-editor/creature-spells/creature-spells");
import rpgArmor = require("equipment/armor/directives/rpg-armor");
import rpgWeapons = require("equipment/weapons/directives/rpg-weapons");
import rpgItems = require("equipment/items/directives/rpg-items");
import rpgSpells = require("magic/directives/rpg-spells");
import { RPGFeaturesController } from "features/directives/rpg-features";
import rpgFlaws = require("flaws/directives/rpg-flaws");
import rpgOaths = require("oaths/directives/rpg-oaths");
import rpgRaces = require("races/directives/rpg-races/rpg-races");
import rpgCreatures = require("creatures/directives/rpg-creatures");
import rpgChapters = require("directives/rpg-chapters");
import rpgLogin = require("players/directives/rpg-login/rpg-login");
import mainController = require("./main-controller");
import introState = require("intro/intro");
import createState = require("create/create");
import description = require("description/description");
import races = require("races/races");
import abilities = require("abilities/abilities");
import skills = require("skills/skills");
import features = require("features/features");
import flaws = require("flaws/flaws");
import oaths = require("oaths/oaths");
import magic = require("magic/magic");
import equipment = require("equipment/equipment");
import creatures = require("creatures/creatures");
import playing = require("playing/playing");
import running = require("running/running");
import weapons = require("equipment/weapons/weapons");
import armor = require("equipment/armor/armor");
import items = require("equipment/items/items");
import combat = require("playing/combat/combat");
import social = require("playing/social/social");
import exploration = require("playing/exploration/exploration");
import healing = require("playing/combat/healing/healing");
import actions = require("playing/combat/actions/actions");

import players = require("players/players");
import playerSession = require("services/rpg-player-session");
import ProfileController from "profile/profile";
import ApiService from "services/api-service";
import ModalService from "services/modal-service";

import hideOnScroll from "directives/rpg-hide-on-scroll-down";
import baseStatsState from "base-stats/base-stats";
import preparingCampaignState from "running/campaign/campaign";
import worldBuildingState from "running/world/world";
import dungeonsState from "running/campaign/dungeons/dungeons";

export class App {
    start(): void {
        var rpgModule = angular.module('app.rpg', ["ui.router", "ngSanitize", "btford.markdown"]);

        rpgModule.directive(creatureDescription.name, () => creatureDescription);
        rpgModule.directive(creatureAbilities.name, () => creatureAbilities);
        rpgModule.directive(creatureEnergy.name, () => creatureEnergy);
        rpgModule.directive(creatureDefense.name, () => creatureDefense);
        rpgModule.directive(creatureWeapons.name, () => creatureWeapons);
        rpgModule.directive(creatureWealth.name, () => creatureWealth);
        rpgModule.directive(creatureItems.name, () => creatureItems);
        rpgModule.directive(creatureFeatures.name, () => creatureFeatures);
        rpgModule.directive(creatureFlaws.name, () => creatureFlaws);
        rpgModule.directive(creatureOaths.name, () => creatureOaths);
        rpgModule.directive(creatureSpells.name, () => creatureSpells);
        rpgModule.directive(rpgArmor.name, () => rpgArmor);
        rpgModule.directive(rpgWeapons.name, () => rpgWeapons);
        rpgModule.directive(rpgItems.name, () => rpgItems);
        rpgModule.directive(rpgSpells.name, () => rpgSpells);
        rpgModule.directive(RPGFeaturesController.directive.name, () => RPGFeaturesController.directive);
        rpgModule.directive(rpgFlaws.name, () => rpgFlaws);
        rpgModule.directive(rpgOaths.name, () => rpgOaths);
        rpgModule.directive(rpgChapters.name, () => rpgChapters);
        rpgModule.directive(rpgRaces.name, () => rpgRaces);
        rpgModule.directive(rpgCreatures.name, () => rpgCreatures);
        rpgModule.directive(rpgLogin.name, () => rpgLogin);
        rpgModule.directive(hideOnScroll.name, () => hideOnScroll);


        rpgModule.directive('rpgFocus', function ($timeout) {
            return {
                link: function (scope, element, attrs: any) {
                    scope.$watch(attrs.rpgFocus, function (val) {
                        if (angular.isDefined(val) && val) {
                            $timeout(function () { element[0].focus(); });
                        }
                    }, true);

                    element.bind('blur', function () {
                        if (angular.isDefined(attrs.rpgFocusLost)) {
                            scope.$apply(attrs.rpgFocusLost);

                        }
                    });
                }
            };
        });


        rpgModule.controller("main", mainController.MainController);

        rpgModule.service("rpgPlayerSession", playerSession.RPGPlayerSession);
        rpgModule.service("apiService", ApiService);
        rpgModule.service("modalService", ModalService);

        rpgModule.directive('title', ['$rootScope', '$timeout',
            function ($rootScope, $timeout) {
                return {
                    link: function () {

                        var listener = function (event, toState) {

                            $timeout(function () {
                                $rootScope.title = (toState.data && toState.data.pageTitle)
                                    ? "Elixr - " + toState.data.pageTitle
                                    : 'Elixr';
                            });
                        };

                        $rootScope.$on('$stateChangeSuccess', listener);
                    }
                };
            }
        ]);

        rpgModule.filter("stat", () => function (input: Elixr.Api.Models.Stat) {
            switch (input) {
                case Elixr.Api.Models.Stat.AbilityPool:
                    return "Ability Points";
                case Elixr.Api.Models.Stat.Acrobatics:
                    return "Acrobatics";
                case Elixr.Api.Models.Stat.AgilityMisc:
                    return "Agility Misc.";
                case Elixr.Api.Models.Stat.NaturalAgilityScore:
                case Elixr.Api.Models.Stat.SpecialAgilityScore:
                    return "Ability Score";
                case Elixr.Api.Models.Stat.AnimalHandling:
                    return "Animal Handling";
                case Elixr.Api.Models.Stat.Athletics:
                    return "Athletics";
                case Elixr.Api.Models.Stat.CharmMisc:
                    return "Charm Misc.";
                case Elixr.Api.Models.Stat.NaturalCharmScore:
                case Elixr.Api.Models.Stat.SpecialCharmScore:
                    return "Charm Score";
                case Elixr.Api.Models.Stat.Climb:
                    return "Climb";
                case Elixr.Api.Models.Stat.Concentration:
                    return "Concentration";
                case Elixr.Api.Models.Stat.Deception:
                    return "Deception";
                case Elixr.Api.Models.Stat.Defense:
                    return "Defense";
                case Elixr.Api.Models.Stat.Diplomacy:
                    return "Diplomacy";
                case Elixr.Api.Models.Stat.Engineer:
                    return "Engineer";
                case Elixr.Api.Models.Stat.EscapeArtist:
                    return "Escape Artist";
                case Elixr.Api.Models.Stat.FeaturePool:
                    return "Feature Points";
                case Elixr.Api.Models.Stat.FocusMisc:
                    return "Focus Misc.";
                case Elixr.Api.Models.Stat.NaturalFocusScore:
                case Elixr.Api.Models.Stat.SpecialFocusScore:
                    return "Focus Score";
                case Elixr.Api.Models.Stat.Initiative:
                    return "Initiative";
                case Elixr.Api.Models.Stat.Insight:
                    return "Insight";
                case Elixr.Api.Models.Stat.Intimidation:
                    return "Intimidation";
                case Elixr.Api.Models.Stat.MaxEnergy:
                    return "Max Energy";
                case Elixr.Api.Models.Stat.Medicine:
                    return "Medicine";
                case Elixr.Api.Models.Stat.None:
                    return "None";
                case Elixr.Api.Models.Stat.Perception:
                    return "Perception";
                case Elixr.Api.Models.Stat.Perform:
                    return "Perform";
                case Elixr.Api.Models.Stat.Recall:
                    return "Recall";
                case Elixr.Api.Models.Stat.SkillPool:
                    return "Skill Points";
                case Elixr.Api.Models.Stat.SleightOfHand:
                    return "Sleight Of Hand";
                case Elixr.Api.Models.Stat.GenericAbilityPool:
                    return "Special Ability Points";
                case Elixr.Api.Models.Stat.Speed:
                    return "Speed";
                case Elixr.Api.Models.Stat.Stealth:
                    return "Stealth";
                case Elixr.Api.Models.Stat.StrengthMisc:
                    return "Strength Misc.";
                case Elixr.Api.Models.Stat.NaturalStrengthScore:
                case Elixr.Api.Models.Stat.SpecialStrengthScore:
                    return "Strength Score";
                case Elixr.Api.Models.Stat.Survival:
                    return "Survival";
                case Elixr.Api.Models.Stat.Swim:
                    return "Swim";
                case Elixr.Api.Models.Stat.Wealth:
                    return "Wealth";
                case Elixr.Api.Models.Stat.WeaponAttackIncrease:
                    return "Weapon Attack Increase";
                case Elixr.Api.Models.Stat.WeaponDamageIncrease:
                    return "Weapon Damage Increase";

                default:
                    return "Missing stat filter";
            }
        });

        rpgModule.filter("modType", () => function (input: Elixr.Api.Models.ModifierType) {
            switch (input) {
                case Elixr.Api.Models.ModifierType.Normal:
                    return "Normal";
                case Elixr.Api.Models.ModifierType.Double:
                    return "Double";
                case Elixr.Api.Models.ModifierType.Halve:
                    return "Halve";

                default:
                    return "Missing mod type filter";
            }
        });

        rpgModule.filter("applyType", () => function (input: Elixr.Api.Models.FeatureApplyingType) {
            switch (input) {
                case Elixr.Api.Models.FeatureApplyingType.Armor:
                    return "Armor";
                case Elixr.Api.Models.FeatureApplyingType.Item:
                    return "Item";
                case Elixr.Api.Models.FeatureApplyingType.Self:
                    return "Creature/Character";
                case Elixr.Api.Models.FeatureApplyingType.Spell:
                    return "Spell";
                case Elixr.Api.Models.FeatureApplyingType.Weapon:
                    return "Weapon";

                default:
                    return "Missing feature applying type filter";
            }
        });

        rpgModule.filter("range", () => function (input: Elixr.Api.Models.Range) {
            switch (input) {
                case Elixr.Api.Models.Range.None:
                    return "-";
                case Elixr.Api.Models.Range.Short:
                    return "Short: 1-50ft";
                case Elixr.Api.Models.Range.Medium:
                    return "Medium: 51-100ft";
                case Elixr.Api.Models.Range.Long:
                    return "Long: 101-200ft";
                case Elixr.Api.Models.Range.Extreme:
                    return "Extreme: 200+ft";

                default:
                    return "Missing range filter";
            }
        });

        rpgModule.filter("regenTime", () => function (regenTimeInRounds: number) {
            if (regenTimeInRounds === 0) {
                return "Concentration";
            }
            if (regenTimeInRounds < 0) {
                return "See Description"
            }
            if (regenTimeInRounds < 10) {
                return regenTimeInRounds + " Rounds";
            }
            let minutes = regenTimeInRounds / 10;
            let extraRounds = regenTimeInRounds % 10;
            let minutesStr = Math.floor(minutes) > 1 ? "Minutes" : "Minute";
            if (extraRounds > 0) {
                return `${Math.floor(minutes)} ${minutesStr} & ${extraRounds} Rounds`;
            }
            return `${Math.floor(minutes)} ${minutesStr}`;
        });

        rpgModule.filter("gold", () => function (wealth: number, includeNegativeSign = true) {
            let sign = "";
            if (wealth < 0) {
                wealth *= -1;
                if (includeNegativeSign) {
                    sign = "-";
                }
            }
            return sign + Math.floor(wealth);
        });
        rpgModule.filter("silver", () => function (wealth: number, includeNegativeSign = true) {
            let silverStr = "";
            let sign = "";
            if (wealth < 0) {
                wealth *= -1;
                if (includeNegativeSign) {
                    sign = "-";
                }
            }
            let justDecimals = wealth - Math.floor(wealth);
            justDecimals = Math.round(justDecimals * 100) / 100;
            silverStr += justDecimals.toString()[2] || "0";
            return sign + silverStr;
        });
        rpgModule.filter("copper", () => function (wealth: number, includeNegativeSign = true) {
            let copperStr = "";
            let sign = "";
            if (wealth < 0) {
                wealth *= -1;
                if (includeNegativeSign) {
                    sign = "-";
                }
            }

            let justDecimals = wealth - Math.floor(wealth);
            justDecimals = Math.round(justDecimals * 100) / 100;
            copperStr += justDecimals.toString()[3] || "0";
            return sign + copperStr;
        });

        rpgModule.filter("wealth", [() => function (wealth: number) {
            wealth = Math.round(wealth * 100) / 100;

            let gold = Math.floor(wealth);

            let wealthWithoutGold = Math.round((wealth - gold) * 100) / 100;
            let silver = Math.floor(wealthWithoutGold * 10);

            let wealthWithoutSilverAndGold = Math.round((wealth - (silver / 10) - gold) * 100) / 100;
            let copper = Math.floor(wealthWithoutSilverAndGold * 100);


            return `${gold} GP, ${silver} SP, ${copper} CP`
        }]);

        rpgModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'markdownConverterProvider', function ($stateProvider: angular.ui.IStateProvider, $urlRouterProvider, $locationProvider, markdown) {

            markdown.config({
                extensions: ['table']
            });

            let states = [introState, createState, description, races, abilities, skills, features, flaws, oaths,
                magic, equipment, creatures, playing, running, weapons, armor, items, social, exploration, combat,
                healing, actions, players, ProfileController.state, baseStatsState, worldBuildingState, 
                preparingCampaignState, dungeonsState];
            states = states.concat(CreatureEditor.states);

            states.forEach(state => {
                $stateProvider.state(state);
            });

            $urlRouterProvider.when('', '/intro');
            $urlRouterProvider.otherwise("/404");
        }]);

        rpgModule.run(["$rootScope", "$state", ($rootScope: angular.IRootScopeService) => {
            $rootScope.$on("$stateChangeStart", () => {
                window.scrollTo(0, 0);
            });

            $rootScope.$on("$stateChangeSuccess", (evt: any, toState: angular.ui.IState) => {
                if (toState.data) {
                    let title = toState.data["title"];
                    if (title) {
                        document.title = `Elixr | ${title}`
                    }
                    else {
                        document.title = "Elixr";
                    }
                }
                else {
                    document.title = "Elixr";
                }
            });
        }]);

        angular.bootstrap(document.body, ['app.rpg']);
    }
}
import { Plugin } from "aliucord/entities";
import { getByName, React, Styles, Toasts } from "aliucord/metro"
import { after } from "aliucord/utils/patcher";
import { General } from "aliucord/ui/components";

import Badges from "./Icons"


const { View, Image, TouchableOpacity } = General;


interface CustomBadges {
    customBadgesArray: {
        badge: string;
        name: string;
    };
    bd: {
        dev: boolean;
    };
    enmity: {
        supporter: {
            data: {
                name: string;
                id: string;
                url: {
                    dark: string;
                    light: string;
                };
            };
        };
        staff: {
            data: {
                name: string;
                id: string;
                url: {
                    dark: string;
                    light: string;
                };
            };
        };
        dev: {
            data: {
                name: string;
                id: string;
                url: {
                    dark: string;
                    light: string;
                };
            };
        };
        contributor: {
            data: {
                name: string;
                id: string;
                url: {
                    dark: string;
                    light: string;
                };
            };
        };
    };
    goosemod: {
        sponsor: boolean;
        dev: boolean;
        translator: boolean;
    };
    replugged: {
        developer: boolean;
        staff: boolean;
        support: boolean;
        contributor: boolean;
        translator: boolean;
        hunter: boolean;
        early: boolean;
        booster: boolean;
        custom: {
            name: string;
            icon: string;
            color: string;
        };
    };
}

type BadgeCache = {
    badges: CustomBadges;
    lastFetch: number;
};

const cache = new Map<string, BadgeCache>();
const REFRESH_INTERVAL = 1000 * 60 * 30;


export default class GlobalBadges extends Plugin {
    public async start() {

        let profileBadges = getByName("ProfileBadges", { default: false });

        const styles = Styles.createThemedStyleSheet({
            container: {
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-end",
            },
            img: {
                width: 24,
                height: 24,
                resizeMode: "contain",
                marginHorizontal: 4
            }
        });

        after(profileBadges, "default", (ctx) => {
            const [, forceUpdate] = React.useReducer(x => x = !x, false);

            const user = ctx.args[0]?.user
            if (user === undefined) return;

            const cachUser = cache.get(user.id);
            if (cachUser === undefined) {
                fetchBadges(user.id, forceUpdate);
                return
            };

            const { customBadgesArray, enmity, replugged } = cachUser?.badges;

            const customBadgesViewable = (
                <View key="gb-custom" style={styles.container}>
                    <TouchableOpacity key={customBadgesArray.badge} onPress={() => {
                        Toasts.open({
                            content: customBadgesArray.name,
                            source: { uri: customBadgesArray.badge }
                        });
                    }}>
                        <Image style={styles.img} source={{ uri: customBadgesArray.badge }} />
                    </TouchableOpacity>
                </View>
            )

            const bdViewable = (
                <View key="gb-bd" style={styles.container}>
                    <TouchableOpacity key="bd-dev" onPress={() => {
                        Toasts.open({
                            content: "BetterDiscord Developer",
                            source: { uri: Badges.bdDevs }
                        });
                    }}>
                        <Image style={styles.img} source={{ uri: Badges.bdDevs }} />
                    </TouchableOpacity>
                </View>
            )

            const enmityViewable = (
                    <View key="gb-enmity" style={styles.container}>
                        <TouchableOpacity key="enmity-supporter" onPress={() => {
                            Toasts.open({
                                content: "Enmity Supporter",
                                source: { uri: enmity?.supporter?.data.url.dark }
                            });
                        }}>
                            <Image style={styles.img} source={{ uri: enmity?.supporter?.data.url.dark }} />
                        </TouchableOpacity>
                    </View>
                )

                const enmityStaffViewable = (
                    <View key="gb-enmitystaff" style={styles.container}>
                        <TouchableOpacity key="enmity-staff" onPress={() => {
                            Toasts.open({
                                content: "Enmity Staff",
                                source: { uri: enmity?.staff?.data?.url.dark }
                            });
                        }}>
                            <Image style={styles.img} source={{ uri: enmity?.staff?.data.url.dark }} />
                        </TouchableOpacity>
                    </View>
                )
        
                const enmityDevViewable = (
                    <View key="gb-enmitydev" style={styles.container}>
                        <TouchableOpacity key="enmity-dev" onPress={() => {
                            Toasts.open({
                                content: "Enmity Developer",
                                source: { uri: enmity?.dev?.data?.url.dark }
                            });
                        }}>
                            <Image style={styles.img} source={{ uri: enmity?.dev?.data.url.dark }} />
                        </TouchableOpacity>
                    </View>
                )
        
                const enmityContributorViewable = (
                    <View key="gb-enmitycontributor" style={styles.container}>
                        <TouchableOpacity key="enmity-contributor" onPress={() => {
                            Toasts.open({
                                content: "Enmity Contributor",
                                source: { uri: enmity?.contributor?.data?.url.dark }
                            });
                        }}>
                            <Image style={styles.img} source={{ uri: enmity?.contributor?.data.url.dark }} />
                        </TouchableOpacity>
                    </View>
                )
        
                const enmityCustomViewable = (
                    <View key="gb-enmitycustom" style={styles.container}>
                        <TouchableOpacity key="enmity-custom" onPress={() => {
                            Toasts.open({
                                content: enmity[user.id]?.data?.name,
                                source: { uri: enmity[user.id]?.data?.url.dark }
                            });
                        }}>
                            <Image style={styles.img} source={{ uri: enmity[user.id]?.data?.url.dark }} />
                        </TouchableOpacity>
                    </View>
                )
            

            const goosemodSponsorViewable = (
                <View key="gb-goosemodsponsor" style={styles.container}>
                    <TouchableOpacity key="goosemod-sponsor" onPress={() => {
                        Toasts.open({
                            content: "GooseMod Sponsor",
                            source: { uri: 'https://goosemod.com/img/goose_globe.png' }
                        });
                    }}>
                        <Image style={styles.img} source={{ uri: 'https://goosemod.com/img/goose_globe.png' }} />
                    </TouchableOpacity>
                </View>
            )
            const goosemodDevViewable = (
                <View key="gb-goosemoddev" style={styles.container}>
                    <TouchableOpacity key="goosemod-dev" onPress={() => {
                        Toasts.open({
                            content: "GooseMod Developer",
                            source: { uri: 'https://goosemod.com/img/goose_glitch.jpg' }
                        });
                    }}>
                        <Image style={styles.img} source={{ uri: 'https://goosemod.com/img/goose_glitch.jpg' }} />
                    </TouchableOpacity>
                </View>
            )

            const goosemodTranslatorViewable = (
                <View key="gb-goosemodtranslator" style={styles.container}>
                    <TouchableOpacity key="goosemod-translator" onPress={() => {
                        Toasts.open({
                            content: "GooseMod Translator",
                            source: { uri: 'https://goosemod.com/img/goose_globe.png' }
                        });
                    }}>
                        <Image style={styles.img} source={{ uri: 'https://goosemod.com/img/goose_globe.png' }} />
                    </TouchableOpacity>
                </View>
            )

            const replugbooster = (
                <View key="gb-replugbooster" style={styles.container}>
                        <Badges.Booster/>
                </View>
            )
        
            const replugBugHunter = (
                <View key="gb-replugbughunter" style={styles.container}>
                        <Badges.BugHunter />
                </View>
            )
        
            const replugContributor = (
                <View key="gb-replugcontributor" style={styles.container}>
                        <Badges.Contributor/>
                </View>
            )
        
            const replugDev = (
                <View key="gb-replugdev" style={styles.container}>
                        <Badges.Developer/>
                </View>
            )
        
            const replugEarlyUser = (
                <View key="gb-replugearlyuser" style={styles.container}>
                        <Badges.EarlyUser />
                </View>
            )
        
            const replugStaff = (
                <View key="gb-replugstaff" style={styles.container}>
                        <Badges.Staff />
                </View>
            )
        
            const replugTranslator = (
                <View key="gb-replugtranslator" style={styles.container}>
                        <Badges.Translator/>
                </View>
            )
        
            const replugCustom = (
                <View key="gb-replugcustom" style={styles.container}>
                    <TouchableOpacity key="replugcustom" onPress={() => {
                        Toasts.open({
                            content: replugged.custom.name,
                            source: { uri: replugged.custom.icon }
                        });
                    }}>
                        <Image style={styles.img} source={{ uri: replugged.custom.icon }} />
                    </TouchableOpacity>
                </View>
            )

            const Badge = {
                customBadgesViewable,
                bdViewable,
                enmityViewable,
                enmityContributorViewable,
                enmityDevViewable,
                enmityStaffViewable,
                enmityCustomViewable,
                goosemodSponsorViewable,
                goosemodDevViewable,
                goosemodTranslatorViewable,
                replugbooster,
                replugBugHunter,
                replugContributor,
                replugDev,
                replugEarlyUser,
                replugStaff,
                replugTranslator,
                replugCustom,
            };
            getBadgesElements(cachUser?.badges, Badge, ctx)

        });

    }
}



async function fetchBadges(userID: string, updateForce: Function) {
    if (!cache.has(userID) || cache.get(userID)!.lastFetch + REFRESH_INTERVAL < Date.now()) {
        const res = await fetch(`https://api.obamabot.me/v2/text/badges?user=${userID}`);
        const body = (await res.json()) as CustomBadges;
        const result: BadgeCache =
            res.status === 200 || res.status === 404
                ? { badges: body || {}, lastFetch: Date.now() }
                : (cache.delete(userID), { badges: body, lastFetch: Date.now() });

        cache.set(userID, result);

        updateForce();
    }
    return cache.get(userID)!.badges;
}

function getBadgesElements(badges: CustomBadges, Badge: any, res: any) {
    const badgeTypes = [
        { condition: badges.customBadgesArray.badge, component: Badge.customBadgesViewable },
        { condition: badges.bd.dev, component: Badge.bdViewable },
        { condition: badges.enmity, component: Badge.enmityViewable },
        { condition: badges.enmity.contributor, component: Badge.enmityContributorViewable },
        { condition: badges.enmity.dev, component: Badge.enmityDevViewable },
        { condition: badges.enmity.staff, component: Badge.enmityStaffViewable },
        { condition: badges.enmity, component: Badge.enmityCustomViewable },
        { condition: badges.goosemod.sponsor, component: Badge.goosemodSponsorViewable },
        { condition: badges.goosemod.dev, component: Badge.goosemodDevViewable },
        { condition: badges.goosemod.translator, component: Badge.goosemodTranslatorViewable },
        { condition: badges.replugged.booster, component: Badge.replugbooster },
        { condition: badges.replugged.hunter, component: Badge.replugBugHunter },
        { condition: badges.replugged.contributor, component: Badge.replugContributor },
        { condition: badges.replugged.developer, component: Badge.replugDev },
        { condition: badges.replugged.early, component: Badge.replugEarlyUser },
        { condition: badges.replugged.staff, component: Badge.replugStaff },
        { condition: badges.replugged.translator, component: Badge.replugTranslator },
        { condition: badges.replugged.custom?.name && badges.replugged.custom.icon, component: Badge.replugCustom },
    ];
    addBadges(res, badgeTypes);
}

async function addBadges(res: any, badges) {
    for (const badge of badges) {
        if (badge.condition) {
            console.log(badge.component)
            res.result.props.children.push(badge.component);
        }
    }
}
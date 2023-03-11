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
    };
    goosemod: {
        sponsor: boolean;
        dev: boolean;
        translator: boolean;
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

            const { customBadgesArray, bd, enmity, goosemod } = cachUser?.badges;
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
            let enmityViewable;
            if (enmity.supporter) {
                enmityViewable = (
                    <View key="gb-enmity" style={styles.container}>
                        <TouchableOpacity key="enmity-supporter" onPress={() => {
                            Toasts.open({
                                content: "Enmity Supporter",
                                source: { uri: enmity.supporter.data.url.dark }
                            });
                        }}>
                            <Image style={styles.img} source={{ uri: enmity.supporter.data.url.dark }} />
                        </TouchableOpacity>
                    </View>
                )
            }

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

            if (!ctx.result) return customBadgesViewable;

            if (customBadgesArray.badge) ctx.result.props.children.push(customBadgesViewable);
            if (bd.dev) ctx.result.props.children.push(bdViewable);
            if (enmity) ctx.result.props.children.push(enmityViewable);
            if (goosemod.sponsor) ctx.result.props.children.push(goosemodSponsorViewable);
            if (goosemod.dev) ctx.result.props.children.push(goosemodDevViewable);
            if (goosemod.translator) ctx.result.props.children.push(goosemodTranslatorViewable);

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
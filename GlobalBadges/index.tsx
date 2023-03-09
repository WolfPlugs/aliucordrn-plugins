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
        console.log('lol');

        const ProfileBadges = getByName("ProfileBadges", { default: false });

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

        after(ProfileBadges, "default", (ctx) => {
            const [, forceUpdate] = React.useReducer(x => x = !x, false);

            const user = ctx.args[0]?.user;
            if (!user) return;

            const badges = cache.get(user.id);
            if (!badges || Date.now() - badges.lastFetch > REFRESH_INTERVAL) {
                fetch(`https://api.obamabot.me/v2/text/badges?user=${user.id}`)
                    .then(res => res.json())
                    .then((data: CustomBadges) => {
                        cache.set(user.id, {
                            badges: data,
                            lastFetch: Date.now()
                        });
                        forceUpdate();
                    });
            }

            const { customBadgesArray, bd, enmity, goosemod } = badges?.badges || {};

            const customBadges = customBadgesArray?.map(badge => (
                <View key={badge.name} style={styles.container}>
                    <TouchableOpacity key={badge.url} onPress={() => { 
                        Toasts.open({
                            content: badge.name,
                            source: { uri: badge.url },
                        });
                    }}>
                        <Image source={{ uri: badge.url }} style={styles.img} />
                    </TouchableOpacity>
                </View>
            ));

            const bdBadges = bd?.dev && (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        Toasts.open({
                            content: "BD Dev",
                            source: { uri: Badges.bdDevs },
                        });
                    }}>
                        <Image source={{ uri: Badges.bdDevs }} style={styles.img} />
                    </TouchableOpacity>
                </View>
            );

            const enmityBadges = enmity?.supporter?.data && (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        Toasts.open({
                            content: "Enmity Supporter",
                            source: { uri: enmity.supporter.data.url.dark },
                        });
                    }}>
                        <Image source={{ uri: enmity.supporter.data.url.dark }} style={styles.img} />
                    </TouchableOpacity>
                </View>
            );

            const goosemodBadges = goosemod?.sponsor && (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        Toasts.open({
                            content: "GooseMod Sponsor",
                            source: { uri: 'https://goosemod.com/img/goose_globe.png' },
                        });
                    }}>
                        <Image source={{ uri: 'https://goosemod.com/img/goose_globe.png' }} style={styles.img} />
                    </TouchableOpacity>
                </View>
            );

            const goosemodBadges2 = goosemod?.dev && (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        Toasts.open({
                            content: "GooseMod Dev",
                            source: { uri: 'https://goosemod.com/img/goose_glitch.jpg' },
                        });
                    }}>
                        <Image source={{ uri: 'https://goosemod.com/img/goose_glitch.jpg' }} style={styles.img} />
                    </TouchableOpacity>
                </View>
            );

            const goosemodBadges3 = goosemod?.translator && (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        Toasts.open({
                            content: "GooseMod Translator",
                            source: { uri: 'https://goosemod.com/img/goose_globe.png' },
                        });
                    }}>
                        <Image source={{ uri: 'https://goosemod.com/img/goose_globe.png' }} style={styles.img} />
                    </TouchableOpacity>
                </View>
            );

            if (!ctx.result) {
                // loop through all the badges and add them to the array
                const thedangbadges = [
                    customBadges,
                    bdBadges,
                    enmityBadges,
                    goosemodBadges,
                    goosemodBadges2,
                    goosemodBadges3
                ];

                // loop through the array and add the badges to the result
                for (let i = 0; i < thedangbadges.length; i++) {
                    if (thedangbadges[i]) {
                        // dont use ctx.result because it will be undefined just return the badges itself 
                        return thedangbadges[i];
                    }
                }

            }

            // use ctx.result.props.children.push() to add the badges to the result and use loops n stuff
            const thedangbadges = [
                customBadges,
                bdBadges,
                enmityBadges,
                goosemodBadges,
                goosemodBadges2,
                goosemodBadges3
            ];

            for (let i = 0; i < thedangbadges.length; i++) {
                if (thedangbadges[i]) {
                    ctx.result.props.children.push(thedangbadges[i]);
                }
            }
            return
        });
    }
}

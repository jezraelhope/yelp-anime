const Anime = require("../models/anime");
const Comment = require("../models/comment")

const anime_seeds = [
    {
        title: "Kimetsu no Yaiba",
        description: "Demon Slayer: Kimetsu no Yaiba – The Movie: Mugen Train, also known as...",
        writer: "Koyoharu Gotouge",
        seasons: 2,
        studio: "Ufotable",
        genre: "shonen",
        storyCompleted: false,
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Kimetsu_no_Yaiba_Mugen_Ressha_Hen_Poster.jpg/220px-Kimetsu_no_Yaiba_Mugen_Ressha_Hen_Poster.jpg",
        releaseDate: "2019-04-06"
        },
    {
        title: "Sailor Moon",
        description: "Sailor Moon,[1][2] originally released in Japan as Pretty Soldier Sailor Moon (Japanese: 美少女戦士セーラームーン, Hepburn: Bishōjo Senshi Sērā Mūn) and later as Pretty Guardian Sailor Moon,[3] is a Japanese superheroine anime television series produced by Toei Animation using Super Sentai motifs. ",
        writer: "Sukehiro Tomita",
        seasons: 5,
        studio: "Toei Animation",
        genre: "shoujo",
        storyCompleted: true,
        image: "https://dw9to29mmj727.cloudfront.net/properties/2016/432-SeriesThumbnails_SM__400x320.jpg",
        releaseDate: "2019-04-06"
    },
    {
        title: "Koe no Katachi",
        description: " A Silent Voice is a 2016 Japanese animated drama film produced by Kyoto Animation, directed by Naoko Yamada and written by Reiko Yoshida, featuring character designs by Futoshi Nishiya and music by Kensuke Ushio. It is based on the manga of the same name written and illustrated by Yoshitoki Ōima.",
        writer: "Yoshitoki Ōima",
        seasons: 1,
        studio: "Kyoto Animation",
        genre: "slice-of-life",
        storyCompleted: true,
        image: "https://upload.wikimedia.org/wikipedia/en/3/32/A_Silent_Voice_Film_Poster.jpg",
        releaseDate: "2017-10-20"
    }
]


const seed = async () => {
    await Anime.deleteMany();
    console.log("deleted all comics")
    await Comment.deleteMany();
    console.log("deleted all comments")

    for (const anime_seed of anime_seeds) {
        let anime = await Anime.create(anime_seed)
        console.log("Created a new Anime!!!", anime.title)

        await Comment.create({
            user: "gruler05",
            text: "The best Anime!!",
            animeId: anime._id
        })
        console.log("created a new comment")
    }
}

module.exports = seed;

//=============================================================================
// first load

function parsePosition(text) {
    var tokens = text.split(":");
    if (tokens.length != 2) {
        tokens = ["chr", "0-0"];
    }

    var tokens2 = tokens[1].split("-");
    var start = parseInt(tokens2[0].replace(/,/g, "")) - 1;
    var end = (tokens2.length > 1 ?
               parseInt(tokens2[1].replace(/,/g, "")) : start + 1);

    return {chrom: tokens[0], start: start, end: end};
};


var b = new Browser({
    chr:          '22',
    viewStart:    1000,
    viewEnd:      2000,
    cookieKey:    'human-grc_h37',

    coordSystem: {
        speciesName: 'Human',
        taxon: 9606,
        auth: 'GRCh',
        version: '37',
        ucscName: 'hg19',
    },

    chains: {
        hg18ToHg19: new Chainset(
            'http://www.derkholm.net:8080/das/hg18ToHg19/', 'NCBI36', 'GRCh37',
            {
                speciesName: 'Human',
                taxon: 9606,
                auth: 'GRCh',
                version: 36
            })
    },

    sources: [
        {
            name: 'Genome',
            twoBitURI: 'http://www.biodalliance.org/datasets/hg19.2bit',
            tier_type: 'sequence',
            provides_entrypoints: true,
            pinned: true
        },
        {
            "name": "Genes",
            "desc": "Gene structures from GENCODE 19",
            "bwgURI": "http://www.biodalliance.org/datasets/gencode.bb",
            "stylesheet_uri": "http://www.biodalliance.org/stylesheets/gencode.xml",
            "collapseSuperGroups": true,
            "trixURI": "http://www.biodalliance.org/datasets/geneIndex.ix"
        },
    ],

    setDocumentTitle: true,
    uiPrefix: '',
    noPersist: true,
    fullScreen: true,

    browserLinks: {
        Ensembl: 'http://ncbi36.ensembl.org/Homo_sapiens/Location/View?r=${chr}:${start}-${end}',
        UCSC: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=chr${chr}:${start}-${end}',
        Sequence: 'http://www.derkholm.net:8080/das/hg19comp/sequence?segment=${chr}:${start},${end}'
    }
});

b.hubs = [
    'http://www.biodalliance.org/datasets/testhub/hub.txt',
    'http://ftp.ebi.ac.uk/pub/databases/ensembl/encode/integration_data_jan2011/hub.txt'
];

b.addViewListener(function(chr, min, max) {
    var view = chr + ":" + min + "-" + max;

    // change ensembl link
    var link = document.getElementById('enslink');
    //link.href = 'http://www.ensembl.org/Homo_sapiens/Location/View?r=' + view;
    link.href = 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=' + view;

    // change url
    var query = parseQueryString(window.location.search.substr(1));
    query.position = view;
    var url = window.location.toString().split("?")[0] +
        "?" + formatQueryString(query);
    history.replaceState({view: view}, '', url);
});

$(document).ready(function () {
    b.realInit();
    b.rulerLocation = "none";

    // default view
    var view = parsePosition("chr17:41,180,051-41,309,898");

    var query = parseQueryString(window.location.search.substr(1));

    // set position
    if (query.position) {
        view = parsePosition(query.position);
    }
    b.setLocation(view.chrom, view.start, view.end);

    // Remove all tiers
    setTimeout(function() {
        //clearTiers();
        loadTiers();
    }, 1000);
    
    //setTimeout(loadTiers, 1000);
});


function clearTiers() {
    while (b.tiers.length > 0) {
        b.removeTier({index: 0});
    }
}


function loadTiers() {
    // add default tiers
    /*
    var tiers = [
        {
            name: 'Genome',
            twoBitURI: 'http://www.biodalliance.org/datasets/hg19.2bit',
            tier_type: 'sequence',
            provides_entrypoints: true,
            pinned: true
        },
        {
            "name": "Genes",
            "desc": "Gene structures from GENCODE 19",
            "bwgURI": "http://www.biodalliance.org/datasets/gencode.bb",
            "stylesheet_uri": "http://www.biodalliance.org/stylesheets/gencode.xml",
            "collapseSuperGroups": true,
            "trixURI": "http://www.biodalliance.org/datasets/geneIndex.ix"
        }
    ];
    for (var i in tiers) {
        b.addTier(tiers[i]);
    }
    */

    // set bam
    var query = parseQueryString(window.location.search.substr(1));
    
    if (query.bam) {
        //$("input[name=bam]").val(query.bam);

        b.addTier({
            "name": "BAM",
            "bamURI": query.bam
        });
    }
}

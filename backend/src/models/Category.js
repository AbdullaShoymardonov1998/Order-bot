const mongoose = require('mongoose');
const { LanguageRequired, LanguageDefault } = require('./Language');
const CategorySchema = new mongoose.Schema(
    {
        title: LanguageRequired,
        description: LanguageDefault,
        picture: {
            uuid: {
                type: String,
                default:null
            }
        },
        parent: {
            type: String,
            ref: "Category",
            default: null
        },
        is_active: {
            type: Boolean,
            default: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        updated_at: {
            type: Date,
            default: Date.now()
        },
        deleted_at: {
            type: Date,
            default: null
        }
    }
);

exports.Category = mongoose.model('Category', CategorySchema);
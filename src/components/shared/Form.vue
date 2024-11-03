<script setup lang="ts">
import { ImageService } from '@/services/ImageService'
import { useToastStore } from '@/stores/toast'
import { DataType } from '@/utils/Constant'

const props = withDefaults(defineProps<{
  item: any;
  forms: any[];
  lineEachItem?: number;
  columnNumber?: number;
  tooltip?: boolean;
  selectMap?: Map<string, any[]>;
}>(), {
  lineEachItem: 1,
  columnNumber: 1,
  tooltip: true,
})
const imageRules = ref<any[]>([])

const handleFileUpload = (form: any, event: any) => {
  const file = event.target.files[0]
  if (!file) {
    useToastStore().showWarning('Vui lòng chọn file')
    return
  }
  ImageService.uploadImage(file)
    .then((res) => {
      props.item[form['key_name']] = res.data.data
      useToastStore().showSuccess('Upload ảnh thành công')
    })
}

</script>

<template>
  <v-row>
    <template v-for="form in forms">
      <template v-if="form['data_type'] === DataType.RELATION">
        <v-col
          :cols="12 / columnNumber"
          class="flex align-content-center"
        >
          <v-row>
            <v-col cols="4" class="flex align-content-center" v-if="lineEachItem === 1">
              <span>
                {{ form['key_title'] }}
              </span>
            </v-col>
            <v-col cols="lineEachItem === 1 ? 8 : 12">
              <span v-if="lineEachItem !== 1">
                {{ form['key_title'] }}
              </span>
              <v-autocomplete
                density="compact"
                hide-details="auto"
                v-model="item[form['relate_table']]"
                :items="selectMap?.get(form['relate_table']) || []"
                item-value="id"
                :item-title="form['relate_column']"
                return-object
                hide-no-data
                no-filter
                @update:search="console.log($event)"
                @click="console.log($event)"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template v-else-if="form['data_type'] === DataType.INTEGER || form['data_type'] === DataType.LONG">
        <v-col
          :cols="12 / columnNumber"
          class="flex align-content-center"
        >
          <v-row v-if="lineEachItem === 1">
            <v-col cols="4" class="flex align-content-center">
              <span>
                {{ form['key_title'] }}
              </span>
            </v-col>
            <v-col cols="8">
              <IntegerNumberInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
              />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <span>
                {{ form['key_title'] }}
              </span>
              <IntegerNumberInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template v-else-if="form['data_type'] === DataType.DOUBLE">
        <v-col
          :cols="12 / columnNumber"
          class="flex align-content-center"
        >
          <v-row v-if="lineEachItem === 1">
            <v-col cols="4" class="flex align-content-center">
              <span>
                {{ form['key_title'] }}
              </span>
            </v-col>
            <v-col cols="8">
              <FloatNumberInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
              />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <span>
                {{ form['key_title'] }}
              </span>
              <FloatNumberInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template v-else-if="form['data_type'] === DataType.IMAGE">

        <v-col
          :cols="12 / columnNumber"
          class="flex align-content-center"
        >
          <v-row v-if="lineEachItem === 1">
            <v-col cols="4" class="flex align-content-center">
              <span>
                {{ form['key_title'] }}
              </span>
            </v-col>
            <v-col cols="8">
              <v-file-input
                :rules="imageRules"
                accept="image/png, image/jpeg, image/bmp"
                @change="handleFileUpload"
                hide-details="auto"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item[form['key_name']]"/>
                  </v-avatar>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <span>
                {{ form['key_title'] }}
              </span>
              <v-file-input
                :rules="imageRules"
                accept="image/png, image/jpeg, image/bmp"
                @change="handleFileUpload(form, $event)"
                prepend-icon=""
                :title="item[form['key_name']]"
                hide-details="auto"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item[form['key_name']]"/>
                  </v-avatar>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template v-else-if="form['data_type'] === DataType.DATETIME">
        <!--        TODO: Datetime in Form-->
      </template>
      <template v-else-if="form['data_type'] === DataType.BOOLEAN">
        <!--        TODO: Boolean in Form-->
      </template>
      <template v-else-if="form['data_type'] === DataType.LONG_STRING">
        <v-col
          :cols="12"
          class="flex align-content-center"
        >
          <v-row v-if="lineEachItem === 1">
            <v-col cols="4" class="flex align-content-center">
              <span>
                {{ form['key_title'] }}
              </span>
            </v-col>
            <v-col cols="8">
              <TextInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
                :is-area="true"
              />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <span>
                {{ form['key_title'] }}
              </span>
              <TextInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
                :is-area="true"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template v-else>
        <v-col
          :cols="12 / columnNumber"
          class="flex align-content-center"
        >
          <v-row v-if="lineEachItem === 1">
            <v-col cols="4" class="flex align-content-center">
              <span>
                {{ form['key_title'] }}
              </span>
            </v-col>
            <v-col cols="8">
              <TextInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
              />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <span>
                {{ form['key_title'] }}
              </span>
              <TextInput
                :editable="form['is_edit']"
                :tooltip="tooltip"
                v-model="item[form['key_name']]"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
    </template>
  </v-row>
</template>

<style lang="sass">
.v-input__prepend
  margin-inline-end: 8px !important
</style>
